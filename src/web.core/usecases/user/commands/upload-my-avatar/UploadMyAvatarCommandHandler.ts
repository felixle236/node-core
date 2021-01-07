import * as mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { UploadMyAvatarCommand } from './UploadMyAvatarCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { User } from '../../../../domain/entities/user/User';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { IStorageService } from '../../../../gateways/services/IStorageService';

@Service()
export class UploadMyAvatarCommandHandler implements ICommandHandler<UploadMyAvatarCommand, string> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(param: UploadMyAvatarCommand): Promise<string> {
        if (!param.userAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        if (!param.file)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'avatar file');

        const ext = mime.extension(param.file.mimetype);
        if (!ext)
            throw new SystemError(MessageError.PARAM_INVALID, 'avatar file');

        User.validateAvatarFile(param.file);
        const avatarPath = User.getAvatarPath(param.userAuthId, ext);
        const data = new User();
        data.avatar = avatarPath;

        let hasSucceed = await this._storageService.upload(avatarPath, param.file.buffer, param.file.mimetype);
        if (!hasSucceed)
            throw new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'avatar file');

        hasSucceed = await this._userRepository.update(param.userAuthId, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return data.avatar;
    }
}
