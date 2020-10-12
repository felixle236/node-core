import * as multer from 'multer';
import { Authorized, Body, CurrentUser, Get, JsonController, Patch, Post, Put, UploadedFile } from 'routing-controllers';
import { GetMyProfileQuery } from '../../../web.core/interactors/user/queries/get-my-profile/GetMyProfileQuery';
import { GetMyProfileQueryHandler } from '../../../web.core/interactors/user/queries/get-my-profile/GetMyProfileQueryHandler';
import { GetMyProfileResult } from '../../../web.core/interactors/user/queries/get-my-profile/GetMyProfileResult';
import { Service } from 'typedi';
import { UpdateMyPasswordCommand } from '../../../web.core/interactors/user/commands/update-my-password/UpdateMyPasswordCommand';
import { UpdateMyPasswordCommandHandler } from '../../../web.core/interactors/user/commands/update-my-password/UpdateMyPasswordCommandHandler';
import { UpdateMyProfileCommand } from '../../../web.core/interactors/user/commands/update-my-profile/UpdateMyProfileCommand';
import { UpdateMyProfileCommandHandler } from '../../../web.core/interactors/user/commands/update-my-profile/UpdateMyProfileCommandHandler';
import { UploadMyAvatarCommand } from '../../../web.core/interactors/user/commands/upload-my-avatar/UploadMyAvatarCommand';
import { UploadMyAvatarCommandHandler } from '../../../web.core/interactors/user/commands/upload-my-avatar/UploadMyAvatarCommandHandler';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/v1/me')
export class MeController {
    constructor(
        private readonly _getMyProfileQueryHandler: GetMyProfileQueryHandler,
        private readonly _updateMyProfileCommandHandler: UpdateMyProfileCommandHandler,
        private readonly _updateMyPasswordCommandHandler: UpdateMyPasswordCommandHandler,
        private readonly _uploadMyAvatarCommandHandler: UploadMyAvatarCommandHandler
    ) {}

    @Get('/')
    @Authorized()
    async getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileResult> {
        const param = new GetMyProfileQuery();
        param.id = userAuth.userId;

        return await this._getMyProfileQueryHandler.handle(param);
    }

    @Put('/')
    @Authorized()
    async updateMyProfile(@Body() param: UpdateMyProfileCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.userAuthId = userAuth.userId;
        return await this._updateMyProfileCommandHandler.handle(param);
    }

    @Patch('/password')
    @Authorized()
    async updateMyPassword(@Body() param: UpdateMyPasswordCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.userAuthId = userAuth.userId;
        return await this._updateMyPasswordCommandHandler.handle(param);
    }

    @Post('/avatar')
    @Authorized()
    async uploadMyAvatar(@UploadedFile('avatar', { required: true, options: { storage: multer.memoryStorage() } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<string> {
        const param = new UploadMyAvatarCommand();
        param.userAuthId = userAuth.userId;
        param.file = file;

        return await this._uploadMyAvatarCommandHandler.handle(param);
    }
}
