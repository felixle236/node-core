import * as fileType from 'file-type';
import { Inject, Service } from 'typedi';
import { BUCKET_NAME } from '../../../../constants/Environments';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IStorageService } from '../../../gateways/services/IStorageService';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UploadMyAvatarOutput } from './Output';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UploadMyAvatarInteractor implements IInteractor<Buffer, UploadMyAvatarOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('storage.service')
    private readonly _storageService: IStorageService;

    async handle(param: Buffer, userAuth: UserAuthenticated): Promise<UploadMyAvatarOutput> {
        const id = userAuth.userId;
        if (!param)
            throw new SystemError();

        const type = await fileType.fromBuffer(param);
        const extension = type ? type.ext : '';

        const data = new User();
        data.validateAvatarFormat(extension);
        data.validateAvatarSize(param.length);

        const avatarPath = data.getAvatarPath(extension);
        const path = await this._storageService.upload(BUCKET_NAME, avatarPath, param);
        data.avatar = path;

        await this._userRepository.update(id, data);
        const url = this._storageService.mapUrl(path);
        return new UploadMyAvatarOutput(url);
    }
}
