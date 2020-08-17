import * as fileType from 'file-type';
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

        const type = await fileType.fromBuffer(file.buffer);
        if (!type)
            throw new SystemError(MessageError.PARAM_INVALID, 'file type');

        User.validateAvatarFile(file);
        const avatarPath = User.getAvatarPath(id, type.ext);
        const data = new User();
        data.avatar = await this._storageService.upload(avatarPath, file.buffer);

        await this._userRepository.update(id, data);
        return new UploadMyAvatarOutput(data.avatar);
    }
}
