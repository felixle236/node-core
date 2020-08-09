import * as multer from 'multer';
import { Authorized, Body, BodyParam, CurrentUser, Get, JsonController, Patch, Post, Put, UploadOptions, UploadedFile } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUserInteractor } from '../../web.core/usecase/boundaries/interactors/IUserInteractor';
import { User } from '../../web.core/domain/entities/User';
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
    @Inject('user.interactor')
    private readonly _userInteractor: IUserInteractor;

    @Get('/')
    @Authorized()
    async getProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<UserResponse | undefined> {
        return await this._userInteractor.getById(userAuth.userId);
    }

    @Put('/')
    @Authorized()
    async updateProfile(@CurrentUser() userAuth: UserAuthenticated, @Body() data: UserUpdateRequest): Promise<UserResponse | undefined> {
        return await this._userInteractor.update(userAuth.userId, data);
    }

    @Patch('/password')
    @Authorized()
    async updatePassword(@CurrentUser() userAuth: UserAuthenticated, @BodyParam('password') password: string, @BodyParam('newPassword') newPassword: string): Promise<boolean> {
        return await this._userInteractor.updatePassword(userAuth.userId, password, newPassword);
    }

    @Post('/avatar')
    @Authorized()
    async uploadAvatar(@CurrentUser() userAuth: UserAuthenticated, @UploadedFile('avatar', { options: avatarUploadOptions }) file: Express.Multer.File): Promise<string> {
        return await this._userInteractor.uploadAvatar(userAuth.userId, file && file.buffer);
    }
}
