import * as multer from 'multer';
import { Authorized, Body, BodyParam, CurrentUser, Get, JsonController, Patch, Post, Put, UploadOptions, UploadedFile } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUserBusiness } from '../../web.core/interfaces/businesses/IUserBusiness';
import { User } from '../../web.core/models/User';
import { UserAuthenticated } from '../../web.core/dtos/common/UserAuthenticated';
import { UserResponse } from '../../web.core/dtos/user/responses/UserResponse';
import { UserUpdateRequest } from '../../web.core/dtos/user/requests/UserUpdateRequest';

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
    @Inject('user.business')
    private readonly _userBusiness: IUserBusiness;

    @Get('/')
    @Authorized()
    async getProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<UserResponse | undefined> {
        return await this._userBusiness.getById(userAuth.userId);
    }

    @Put('/')
    @Authorized()
    async updateProfile(@CurrentUser() userAuth: UserAuthenticated, @Body() data: UserUpdateRequest): Promise<UserResponse | undefined> {
        return await this._userBusiness.update(userAuth.userId, data);
    }

    @Patch('/password')
    @Authorized()
    async updatePassword(@CurrentUser() userAuth: UserAuthenticated, @BodyParam('password') password: string, @BodyParam('newPassword') newPassword: string): Promise<boolean> {
        return await this._userBusiness.updatePassword(userAuth.userId, password, newPassword);
    }

    @Post('/avatar')
    @Authorized()
    async uploadAvatar(@CurrentUser() userAuth: UserAuthenticated, @UploadedFile('avatar', { options: avatarUploadOptions }) file: Express.Multer.File): Promise<string> {
        return await this._userBusiness.uploadAvatar(userAuth.userId, file && file.buffer);
    }
}
