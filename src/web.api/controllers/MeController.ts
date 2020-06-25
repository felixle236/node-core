import * as multer from 'multer';
import { Authorized, Body, CurrentUser, Get, JsonController, Patch, Post, Put, UploadOptions, UploadedFile } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUserBusiness } from '../../web.core/interfaces/businesses/IUserBusiness';
import { User } from '../../web.core/models/User';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { UserPasswordUpdateRequest } from '../../web.core/dtos/user/requests/UserPasswordUpdateRequest';
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
        return await this._userBusiness.getById(userAuth.id);
    }

    @Put('/')
    @Authorized()
    async updateProfile(@CurrentUser() userAuth: UserAuthenticated, @Body() data: UserUpdateRequest): Promise<UserResponse | undefined> {
        return await this._userBusiness.update(userAuth.id, data);
    }

    @Patch('/password')
    @Authorized()
    async updatePassword(@CurrentUser() userAuth: UserAuthenticated, @Body() data: UserPasswordUpdateRequest): Promise<boolean> {
        return await this._userBusiness.updatePassword(userAuth.id, data);
    }

    @Post('/avatar')
    @Authorized()
    async uploadAvatar(@CurrentUser() userAuth: UserAuthenticated, @UploadedFile('avatar', { options: avatarUploadOptions }) file: Express.Multer.File): Promise<string> {
        return await this._userBusiness.uploadAvatar(userAuth.id, file && file.buffer);
    }
}
