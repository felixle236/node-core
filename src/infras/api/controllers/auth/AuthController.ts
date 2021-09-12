import { HandleOptionRequest } from '@shared/decorators/HandleOptionRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { ForgotPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandHandler';
import { ForgotPasswordByEmailCommandInput } from '@usecases/auth/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandInput';
import { ForgotPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandOutput';
import { ResetPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/reset-password-by-email/ResetPasswordByEmailCommandHandler';
import { ResetPasswordByEmailCommandInput } from '@usecases/auth/auth/commands/reset-password-by-email/ResetPasswordByEmailCommandInput';
import { ResetPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/reset-password-by-email/ResetPasswordByEmailCommandOutput';
import { UpdateMyPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandHandler';
import { UpdateMyPasswordByEmailCommandInput } from '@usecases/auth/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandInput';
import { UpdateMyPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandOutput';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryInput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryInput';
import { GetUserAuthByJwtQueryOutput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryOutput';
import { LoginByEmailQueryHandler } from '@usecases/auth/auth/queries/login-by-email/LoginByEmailQueryHandler';
import { LoginByEmailQueryInput } from '@usecases/auth/auth/queries/login-by-email/LoginByEmailQueryInput';
import { LoginByEmailQueryOutput } from '@usecases/auth/auth/queries/login-by-email/LoginByEmailQueryOutput';
import { ValidateForgotKeyForEmailCommandHandler } from '@usecases/auth/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommandHandler';
import { ValidateForgotKeyForEmailCommandInput } from '@usecases/auth/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommandInput';
import { ValidateForgotKeyForEmailCommandOutput } from '@usecases/auth/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommandOutput';
import { Authorized, Body, CurrentUser, HeaderParam, JsonController, Patch, Post, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/auths')
export class AuthController {
    constructor(
        private readonly _getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler,
        private readonly _loginByEmailQueryHandler: LoginByEmailQueryHandler,
        private readonly _forgotPasswordByEmailCommandHandler: ForgotPasswordByEmailCommandHandler,
        private readonly _validateForgotKeyForEmailCommandHandler: ValidateForgotKeyForEmailCommandHandler,
        private readonly _resetPasswordByEmailCommandHandler: ResetPasswordByEmailCommandHandler,
        private readonly _updateMyPasswordByEmailCommandHandler: UpdateMyPasswordByEmailCommandHandler
    ) {}

    @Post('/')
    @OpenAPI({
        summary: 'Verify access token by header param or query param',
        security: []
    })
    @ResponseSchema(GetUserAuthByJwtQueryOutput)
    async authenticate(@QueryParams() param: GetUserAuthByJwtQueryInput, @HeaderParam('authorization') authorization: string, @HandleOptionRequest() handleOption: HandleOption): Promise<GetUserAuthByJwtQueryOutput> {
        if (authorization) {
            const parts = authorization.split(' ');
            const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
            param.token = token;
        }
        return await this._getUserAuthByJwtQueryHandler.handle(param, handleOption);
    }

    @Post('/login')
    @OpenAPI({
        summary: 'Authenticate user by email and password',
        description: 'Applies to any user<br/>Return access token',
        security: []
    })
    @ResponseSchema(LoginByEmailQueryOutput)
    async login(@Body() param: LoginByEmailQueryInput): Promise<LoginByEmailQueryOutput> {
        return await this._loginByEmailQueryHandler.handle(param);
    }

    @Post('/forgot-password')
    @OpenAPI({
        summary: 'Forgot user\'s password by email',
        security: []
    })
    @ResponseSchema(ForgotPasswordByEmailCommandOutput)
    async forgotPassword(@Body() param: ForgotPasswordByEmailCommandInput): Promise<ForgotPasswordByEmailCommandOutput> {
        return await this._forgotPasswordByEmailCommandHandler.handle(param);
    }

    @Post('/validate-forgot-key')
    @OpenAPI({
        summary: 'Validate the forgot key by email and key',
        security: []
    })
    @ResponseSchema(ValidateForgotKeyForEmailCommandOutput)
    async validateForgotKey(@Body() param: ValidateForgotKeyForEmailCommandInput): Promise<ValidateForgotKeyForEmailCommandOutput> {
        return await this._validateForgotKeyForEmailCommandHandler.handle(param);
    }

    @Post('/reset-password')
    @OpenAPI({
        summary: 'Reset user\'s password',
        security: []
    })
    @ResponseSchema(ResetPasswordByEmailCommandOutput)
    async resetPassword(@Body() param: ResetPasswordByEmailCommandInput): Promise<ResetPasswordByEmailCommandOutput> {
        return await this._resetPasswordByEmailCommandHandler.handle(param);
    }

    @Patch('/password')
    @Authorized()
    @OpenAPI({ summary: 'Update my password' })
    @ResponseSchema(UpdateMyPasswordByEmailCommandOutput)
    async updateMyPassword(@Body() param: UpdateMyPasswordByEmailCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateMyPasswordByEmailCommandOutput> {
        return await this._updateMyPasswordByEmailCommandHandler.handle(userAuth.userId, param);
    }
}
