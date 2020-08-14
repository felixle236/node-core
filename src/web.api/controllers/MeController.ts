import * as multer from 'multer';
import { Authorized, Body, CurrentUser, Get, JsonController, Patch, Post, Put, UploadOptions, UploadedFile } from 'routing-controllers';
import { BooleanResult } from '../../web.core/domain/common/outputs/BooleanResult';
import { GetMyProfileInteractor } from '../../web.core/interactors/me/get-my-profile/Interactor';
import { GetMyProfileOutput } from '../../web.core/interactors/me/get-my-profile/Output';
import { Service } from 'typedi';
import { UpdateMyPasswordInput } from '../../web.core/interactors/me/update-my-password/Input';
import { UpdateMyPasswordInteractor } from '../../web.core/interactors/me/update-my-password/Interactor';
import { UpdateMyProfileInput } from '../../web.core/interactors/me/update-my-profile/Input';
import { UpdateMyProfileInteractor } from '../../web.core/interactors/me/update-my-profile/Interactor';
import { UploadMyAvatarInteractor } from '../../web.core/interactors/me/upload-my-avatar/Interactor';
import { UploadMyAvatarOutput } from '../../web.core/interactors/me/upload-my-avatar/Output';
import { User } from '../../web.core/domain/entities/User';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

const avatarUploadOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fieldNameSize: 100,
        fileSize: User.getMaxAvatarSize()
    }
} as UploadOptions;

@Service()
@JsonController('/me')
export class MeController {
    constructor(
        private _getMyProfileInteractor: GetMyProfileInteractor,
        private _updateMyProfileInteractor: UpdateMyProfileInteractor,
        private _updateMyPasswordInteractor: UpdateMyPasswordInteractor,
        private _uploadMyAvatarInteractor: UploadMyAvatarInteractor
    ) {}

    @Get('/')
    @Authorized()
    async getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileOutput> {
        return await this._getMyProfileInteractor.handle(userAuth);
    }

    @Put('/')
    @Authorized()
    async updateMyProfile(@Body() data: UpdateMyProfileInput, @CurrentUser() userAuth: UserAuthenticated): Promise<BooleanResult> {
        return await this._updateMyProfileInteractor.handle(data, userAuth);
    }

    @Patch('/password')
    @Authorized()
    async updateMyPassword(@Body() data: UpdateMyPasswordInput, @CurrentUser() userAuth: UserAuthenticated): Promise<BooleanResult> {
        return await this._updateMyPasswordInteractor.handle(data, userAuth);
    }

    @Post('/avatar')
    @Authorized()
    async uploadMyAvatar(@UploadedFile('avatar', { options: avatarUploadOptions }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<UploadMyAvatarOutput> {
        return await this._uploadMyAvatarInteractor.handle(file && file.buffer, userAuth);
    }
}
