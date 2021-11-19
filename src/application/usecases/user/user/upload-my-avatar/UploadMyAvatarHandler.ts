import { User } from 'domain/entities/user/User';
import { IUserRepository } from 'application/interfaces/repositories/user/IUserRepository';
import { IStorageService } from 'application/interfaces/services/IStorageService';
import mime from 'mime-types';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { SystemError } from 'shared/exceptions/SystemError';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { removeFile } from 'utils/file';
import { UploadMyAvatarInput } from './UploadMyAvatarInput';
import { UploadMyAvatarOutput } from './UploadMyAvatarOutput';

@Service()
export class UploadMyAvatarHandler implements IUsecaseHandler<UploadMyAvatarInput, UploadMyAvatarOutput> {
    constructor(
        @Inject(InjectService.Storage) private readonly _storageService: IStorageService,
        @Inject(InjectRepository.User) private readonly _userRepository: IUserRepository
    ) {}

    async handle(id: string, param: UploadMyAvatarInput): Promise<UploadMyAvatarOutput> {
        const file = param.file;
        const ext = mime.extension(file.mimetype);
        if (!ext)
            throw new SystemError(MessageError.PARAM_INVALID, { t: 'avatar' });

        User.validateAvatarFile(file);
        const avatarPath = `users/${id}/images/avatar.${ext}`;

        const user = await this._userRepository.get(id);
        if (!user)
            throw new NotFoundError();

        let hasSucceed = await this._storageService.upload(avatarPath, file.path, { mimetype: file.mimetype, size: file.size })
            .finally(() => removeFile(file.path));
        if (!hasSucceed)
            throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, { t: 'avatar' });

        const data = new User();
        data.avatar = this._storageService.mapUrl(avatarPath);
        hasSucceed = await this._userRepository.update(id, data);

        const result = new UploadMyAvatarOutput();
        result.data = data.avatar;
        return result;
    }
}
