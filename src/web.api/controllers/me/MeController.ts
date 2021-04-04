import * as multer from 'multer';
import { Authorized, Body, BodyParam, CurrentUser, Get, JsonController, Patch, Post, Put, UploadedFile } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { STORAGE_UPLOAD_DIR } from '../../../configs/Configuration';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';
import { UpdateMyPasswordByEmailCommand } from '../../../web.core/usecases/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommand';
import { UpdateMyPasswordByEmailCommandHandler } from '../../../web.core/usecases/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandHandler';
import { UpdateMyProfileCommand } from '../../../web.core/usecases/user/commands/update-my-profile/UpdateMyProfileCommand';
import { UpdateMyProfileCommandHandler } from '../../../web.core/usecases/user/commands/update-my-profile/UpdateMyProfileCommandHandler';
import { UploadMyAvatarCommand } from '../../../web.core/usecases/user/commands/upload-my-avatar/UploadMyAvatarCommand';
import { UploadMyAvatarCommandHandler } from '../../../web.core/usecases/user/commands/upload-my-avatar/UploadMyAvatarCommandHandler';
import { GetMyProfileQuery } from '../../../web.core/usecases/user/queries/get-my-profile/GetMyProfileQuery';
import { GetMyProfileQueryHandler } from '../../../web.core/usecases/user/queries/get-my-profile/GetMyProfileQueryHandler';
import { GetMyProfileQueryResult } from '../../../web.core/usecases/user/queries/get-my-profile/GetMyProfileQueryResult';

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, STORAGE_UPLOAD_DIR);
    },
    filename(_req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});

@Service()
@JsonController('/v1/me')
export class MeController {
    constructor(
        private readonly _getMyProfileQueryHandler: GetMyProfileQueryHandler,
        private readonly _updateMyProfileCommandHandler: UpdateMyProfileCommandHandler,
        private readonly _updateMyPasswordByEmailCommandHandler: UpdateMyPasswordByEmailCommandHandler,
        private readonly _uploadMyAvatarCommandHandler: UploadMyAvatarCommandHandler
    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({
        description: 'Get my profile information.'
    })
    async getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileQueryResult> {
        const param = new GetMyProfileQuery();
        param.id = userAuth.userId;

        return await this._getMyProfileQueryHandler.handle(param);
    }

    @Put('/')
    @Authorized()
    @OpenAPI({
        description: 'Update my profile information.'
    })
    async updateMyProfile(@Body() param: UpdateMyProfileCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.userAuthId = userAuth.userId;
        return await this._updateMyProfileCommandHandler.handle(param);
    }

    @Patch('/password')
    @Authorized()
    @OpenAPI({
        description: 'Update my password.'
    })
    async updateMyPassword(@BodyParam('password') password: string, @BodyParam('newPassword') newPassword: string, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        const param = new UpdateMyPasswordByEmailCommand();
        param.userAuthId = userAuth.userId;
        param.oldPassword = password;
        param.password = newPassword;

        return await this._updateMyPasswordByEmailCommandHandler.handle(param);
    }

    @Post('/avatar')
    @Authorized()
    @OpenAPI({
        description: 'Upload my avatar.'
    })
    async uploadMyAvatar(@UploadedFile('avatar', { required: true, options: { storage } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<string> {
        const param = new UploadMyAvatarCommand();
        param.userAuthId = userAuth.userId;
        param.file = file;

        return await this._uploadMyAvatarCommandHandler.handle(param);
    }
}
