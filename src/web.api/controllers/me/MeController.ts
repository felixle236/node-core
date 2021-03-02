import * as multer from 'multer';
import { Authorized, Body, BodyParam, CurrentUser, Get, JsonController, Patch, Post, Put, UploadedFile } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { MessageError } from '../../../web.core/domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../web.core/domain/common/exceptions/SystemError';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';
import { RoleId } from '../../../web.core/domain/enums/role/RoleId';
import { GenderType } from '../../../web.core/domain/enums/user/GenderType';
import { UpdateMyPasswordByEmailCommand } from '../../../web.core/usecases/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommand';
import { UpdateMyPasswordByEmailCommandHandler } from '../../../web.core/usecases/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandHandler';
import { UpdateMyProfileClientCommand } from '../../../web.core/usecases/client/commands/update-my-profile-client/UpdateMyProfileClientCommand';
import { UpdateMyProfileClientCommandHandler } from '../../../web.core/usecases/client/commands/update-my-profile-client/UpdateMyProfileClientCommandHandler';
import { GetMyProfileClientQuery } from '../../../web.core/usecases/client/queries/get-my-profile-client/GetMyProfileClientQuery';
import { GetMyProfileClientQueryHandler } from '../../../web.core/usecases/client/queries/get-my-profile-client/GetMyProfileClientQueryHandler';
import { UpdateMyProfileManagerCommand } from '../../../web.core/usecases/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommand';
import { UpdateMyProfileManagerCommandHandler } from '../../../web.core/usecases/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandHandler';
import { GetMyProfileManagerQuery } from '../../../web.core/usecases/manager/queries/get-my-profile-manager/GetMyProfileManagerQuery';
import { GetMyProfileManagerQueryHandler } from '../../../web.core/usecases/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryHandler';
import { UploadMyAvatarCommand } from '../../../web.core/usecases/user/commands/upload-my-avatar/UploadMyAvatarCommand';
import { UploadMyAvatarCommandHandler } from '../../../web.core/usecases/user/commands/upload-my-avatar/UploadMyAvatarCommandHandler';

@Service()
@JsonController('/v1/me')
export class MeController {
    constructor(
        private readonly _getMyProfileClientQueryHandler: GetMyProfileClientQueryHandler,
        private readonly _getMyProfileManagerQueryHandler: GetMyProfileManagerQueryHandler,
        private readonly _updateMyProfileClientCommandHandler: UpdateMyProfileClientCommandHandler,
        private readonly _updateMyProfileManagerCommandHandler: UpdateMyProfileManagerCommandHandler,
        private readonly _updateMyPasswordByEmailCommandHandler: UpdateMyPasswordByEmailCommandHandler,
        private readonly _uploadMyAvatarCommandHandler: UploadMyAvatarCommandHandler
    ) {}

    @Get('/')
    @Authorized()
    @OpenAPI({
        description: 'Get my profile information.'
    })
    async getMyProfile(@CurrentUser() userAuth: UserAuthenticated) {
        switch (userAuth.roleId) {
        case RoleId.SUPER_ADMIN:
        case RoleId.MANAGER:
            return await this._getMyProfileManagerQueryHandler.handle(new GetMyProfileManagerQuery(userAuth.userId));

        case RoleId.CLIENT:
            return await this._getMyProfileClientQueryHandler.handle(new GetMyProfileClientQuery(userAuth.userId));

        default:
            throw new SystemError(MessageError.DATA_INVALID);
        }
    }

    @Put('/')
    @Authorized()
    @OpenAPI({
        description: 'Update my profile information.'
    })
    async updateMyProfile(@Body() body: {
        firstName: string,
        lastName: string | null,
        gender: GenderType | null,
        birthday: string | null,
        phone: string | null,
        address: string | null,
        culture: string | null,
        currency: string | null
    }, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        switch (userAuth.roleId) {
        case RoleId.SUPER_ADMIN:
        case RoleId.MANAGER: {
            const param = new UpdateMyProfileManagerCommand();
            param.userAuthId = userAuth.userId;
            param.firstName = body.firstName;
            param.lastName = body.lastName;

            return await this._updateMyProfileManagerCommandHandler.handle(param);
        }
        case RoleId.CLIENT: {
            const param = new UpdateMyProfileClientCommand();
            param.userAuthId = userAuth.userId;
            param.firstName = body.firstName;
            param.lastName = body.lastName;
            param.gender = body.gender;
            param.birthday = body.birthday;
            param.phone = body.phone;
            param.address = body.address;
            param.culture = body.culture;
            param.currency = body.currency;

            return await this._updateMyProfileClientCommandHandler.handle(param);
        }
        default:
            throw new SystemError(MessageError.DATA_INVALID);
        }
    }

    @Patch('/password')
    @Authorized()
    @OpenAPI({
        description: 'Update my password.'
    })
    async updateMyPassword(@BodyParam('password') password: string, @BodyParam('newPassword') newPassword: string, @CurrentUser() userAuth: UserAuthenticated) {
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
    async uploadMyAvatar(@UploadedFile('avatar', { required: true, options: { storage: multer.memoryStorage() } }) file: Express.Multer.File, @CurrentUser() userAuth: UserAuthenticated): Promise<string> {
        const param = new UploadMyAvatarCommand();
        param.userAuthId = userAuth.userId;
        param.file = file;

        return await this._uploadMyAvatarCommandHandler.handle(param);
    }
}
