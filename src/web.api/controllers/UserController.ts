import { Authorized, Body, BodyParam, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';
import { FindUserInteractor } from '../../web.core/interactors/user/find-user/Interactor';
import { GetUserByIdInteractor } from '../../web.core/interactors/user/get-user-by-id/Interactor';
import { CreateUserInteractor } from '../../web.core/interactors/user/create-user/Interactor';
import { UpdateUserInteractor } from '../../web.core/interactors/user/update-user/Interactor';
import { SignupInteractor } from '../../web.core/interactors/user/signup/Interactor';
import { ActiveUserInteractor } from '../../web.core/interactors/user/active-user/Interactor';
import { ResendActivationInteractor } from '../../web.core/interactors/user/resend-activation/Interactor';
import { ForgotPasswordInteractor } from '../../web.core/interactors/user/forgot-password/Interactor';
import { ArchiveUserInteractor } from '../../web.core/interactors/user/archive-user/Interactor';
import { DeleteUserInteractor } from '../../web.core/interactors/user/delete-user/Interactor';

@Service()
@JsonController('/users')
export class UserController {
    constructor(
        private _findUserInteractor: FindUserInteractor,
        private _getUserByIdInteractor: GetUserByIdInteractor,
        private _createUserInteractor: CreateUserInteractor,
        private _updateUserInteractor: UpdateUserInteractor,
        private _signupInteractor: SignupInteractor,
        private _activeUserInteractor: ActiveUserInteractor,
        private _resendActivationInteractor: ResendActivationInteractor,
        private _forgotPasswordInteractor: ForgotPasswordInteractor,
        private _archiveUserInteractor: ArchiveUserInteractor,
        private _deleteUserInteractor: DeleteUserInteractor
    ) {}

    @Get('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async find(@CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: UserFilterRequest): Promise<ResultListResponse<UserResponse>> {
        return await this._userInteractor.find(filter, userAuth);
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
