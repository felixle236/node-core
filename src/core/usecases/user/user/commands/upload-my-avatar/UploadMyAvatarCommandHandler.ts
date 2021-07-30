import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { IStorageService } from '@gateways/services/IStorageService';
import { validateDataInput } from '@libs/common';
import { removeFile } from '@libs/file';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { UploadMyAvatarCommandInput } from './UploadMyAvatarCommandInput';
import { UploadMyAvatarCommandOutput } from './UploadMyAvatarCommandOutput';

@Service()
export class UploadMyAvatarCommandHandler extends CommandHandler<UploadMyAvatarCommandInput, UploadMyAvatarCommandOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(id: string, param: UploadMyAvatarCommandInput): Promise<UploadMyAvatarCommandOutput> {
        await validateDataInput(param);

        const file = param.file;
        const ext = mime.extension(file.mimetype);
        if (!ext)
            throw new SystemError(MessageError.PARAM_INVALID, 'avatar');

        User.validateAvatarFile(file);
        const avatarPath = User.getAvatarPath(id, ext);
        const data = new User();
        data.avatar = avatarPath;

        let hasSucceed = await this._storageService.upload(avatarPath, file.path, { mimetype: file.mimetype, size: file.size })
            .finally(() => removeFile(file.path));
        if (!hasSucceed)
            throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'avatar');

        hasSucceed = await this._userRepository.update(id, data);
        const result = new UploadMyAvatarCommandOutput();
        result.setData(data.avatar);
        return result;
    }
}
