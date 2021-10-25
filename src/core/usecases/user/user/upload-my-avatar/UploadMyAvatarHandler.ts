import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { IStorageService } from '@gateways/services/IStorageService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { removeFile } from '@utils/file';
import mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { UploadMyAvatarInput } from './UploadMyAvatarInput';
import { UploadMyAvatarOutput } from './UploadMyAvatarOutput';

@Service()
export class UploadMyAvatarHandler extends UsecaseHandler<UploadMyAvatarInput, UploadMyAvatarOutput> {
    constructor(
        @Inject('user.repository') private readonly _userRepository: IUserRepository,
        @Inject('storage.service') private readonly _storageService: IStorageService
    ) {
        super();
    }

    async handle(id: string, param: UploadMyAvatarInput): Promise<UploadMyAvatarOutput> {
        const file = param.file;
        const ext = mime.extension(file.mimetype);
        if (!ext)
            throw new SystemError(MessageError.PARAM_INVALID, { t: 'avatar' });

        User.validateAvatarFile(file);
        const avatarPath = User.getAvatarPath(id, ext);
        const data = new User();
        data.avatar = avatarPath;

        const user = await this._userRepository.get(id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        let hasSucceed = await this._storageService.upload(avatarPath, file.path, { mimetype: file.mimetype, size: file.size })
            .finally(() => removeFile(file.path));
        if (!hasSucceed)
            throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, { t: 'avatar' });

        hasSucceed = await this._userRepository.update(id, data);
        const result = new UploadMyAvatarOutput();
        result.data = data.avatar;
        return result;
    }
}
