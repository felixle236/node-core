import { Authorized, Body, BodyParam, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUserInteractor } from '../../web.core/interfaces/interactors/IUserInteractor';
import { ResultListResponse } from '../../web.core/dtos/common/ResultListResponse';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { UserAuthenticated } from '../../web.core/dtos/common/UserAuthenticated';
import { UserCommonFilterRequest } from '../../web.core/dtos/user/requests/UserCommonFilterRequest';
import { UserCommonResponse } from '../../web.core/dtos/user/responses/UserCommonResponse';
import { UserCreateRequest } from '../../web.core/dtos/user/requests/UserCreateRequest';
import { UserFilterRequest } from '../../web.core/dtos/user/requests/UserFilterRequest';
import { UserRegisterRequest } from '../../web.core/dtos/user/requests/UserRegisterRequest';
import { UserResponse } from '../../web.core/dtos/user/responses/UserResponse';
import { UserUpdateRequest } from '../../web.core/dtos/user/requests/UserUpdateRequest';

@Service()
@JsonController('/users')
export class UserController {
    @Inject('user.interactor')
    private readonly _userInteractor: IUserInteractor;

    @Get('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async find(@CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: UserFilterRequest): Promise<ResultListResponse<UserResponse>> {
        return await this._userInteractor.find(filter, userAuth);
    }

    @Get('/common')
    @Authorized(RoleId.SUPER_ADMIN)
    async findCommon(@CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: UserCommonFilterRequest): Promise<ResultListResponse<UserCommonResponse>> {
        return await this._userInteractor.findCommon(filter, userAuth);
    }

    @Get('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async getById(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<UserResponse | undefined> {
        return await this._userInteractor.getById(id, userAuth);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@CurrentUser() userAuth: UserAuthenticated, @Body() data: UserCreateRequest): Promise<UserResponse | undefined> {
        return await this._userInteractor.create(data, userAuth);
    }

    @Put('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number, @Body() data: UserUpdateRequest): Promise<UserResponse | undefined> {
        return await this._userInteractor.update(id, data, userAuth);
    }

    @Post('/register')
    async register(@Body() data: UserRegisterRequest): Promise<UserResponse | undefined> {
        return await this._userInteractor.register(data);
    }

    @Post('/active')
    async active(@BodyParam('confirmKey') confirmKey: string): Promise<boolean> {
        return await this._userInteractor.active(confirmKey);
    }

    @Post('/resend-activation')
    async resendActivation(@BodyParam('email') email: string): Promise<boolean> {
        return await this._userInteractor.resendActivation(email);
    }

    @Post('/forgot-password')
    async forgotPassword(@BodyParam('email') email: string): Promise<boolean> {
        return await this._userInteractor.forgotPassword(email);
    }

    @Post('/reset-password')
    async resetPassword(@BodyParam('confirmKey') confirmKey: string, @BodyParam('password') password: string): Promise<boolean> {
        return await this._userInteractor.resetPassword(confirmKey, password);
    }

    @Post('/:id([0-9]+)/archive')
    @Authorized(RoleId.SUPER_ADMIN)
    async archive(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<boolean> {
        return await this._userInteractor.archive(id, userAuth);
    }

    @Delete('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<boolean> {
        return await this._userInteractor.delete(id, userAuth);
    }
}
