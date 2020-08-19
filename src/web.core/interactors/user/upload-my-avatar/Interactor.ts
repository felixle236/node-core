import * as mime from 'mime-types';
import { Inject, Service } from 'typedi';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IStorageService } from '../../../gateways/services/IStorageService';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UploadMyAvatarOutput } from './Output';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UploadMyAvatarInteractor implements IInteractor<Express.Multer.File, UploadMyAvatarOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(file: Express.Multer.File, userAuth: UserAuthenticated): Promise<UploadMyAvatarOutput> {
        const id = userAuth.userId;
        const ext = mime.extension(file.mimetype);
        if (!ext)
            throw new SystemError(MessageError.PARAM_INVALID, 'avatar');

        User.validateAvatarFile(file);
        const avatarPath = User.getAvatarPath(id, ext);
        const data = new User();
        data.avatar = avatarPath;

        await this._storageService.upload(avatarPath, file.buffer);
        await this._userRepository.update(id, data);
        return new UploadMyAvatarOutput(data.avatar);
    }
}
