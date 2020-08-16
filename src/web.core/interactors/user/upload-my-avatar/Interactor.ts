import { Inject, Service } from 'typedi';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IStorageService } from '../../../gateways/services/IStorageService';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
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
        const data = new User();
        const avatarPath = await data.setAvatar(id, file);

        await this._storageService.upload(avatarPath, file.buffer);
        await this._userRepository.update(id, data);

        const url = this._storageService.mapUrl(avatarPath);
        return new UploadMyAvatarOutput(url);
    }
}
