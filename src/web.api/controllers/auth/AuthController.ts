import { BodyParam, HeaderParam, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ForgotPasswordByEmailCommand } from '../../../web.core/usecases/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommand';
import { ForgotPasswordByEmailCommandHandler } from '../../../web.core/usecases/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandHandler';
import { ResetPasswordByEmailCommand } from '../../../web.core/usecases/auth/commands/reset-password-by-email/ResetPasswordByEmailCommand';
import { ResetPasswordByEmailCommandHandler } from '../../../web.core/usecases/auth/commands/reset-password-by-email/ResetPasswordByEmailCommandHandler';
import { GetUserAuthByJwtQuery } from '../../../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQuery';
import { GetUserAuthByJwtQueryHandler } from '../../../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { LoginByEmailQuery } from '../../../web.core/usecases/auth/queries/login-by-email/LoginByEmailQuery';
import { LoginByEmailQueryHandler } from '../../../web.core/usecases/auth/queries/login-by-email/LoginByEmailQueryHandler';
import { ValidateForgotKeyForEmailCommand } from '../../../web.core/usecases/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommand';
import { ValidateForgotKeyForEmailCommandHandler } from '../../../web.core/usecases/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommandHandler';

@Service()
@JsonController('/v1/auth')
export class AuthController {
    constructor(
        private readonly _getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler,
        private readonly _loginByEmailQueryHandler: LoginByEmailQueryHandler,
        private readonly _forgotPasswordByEmailCommandHandler: ForgotPasswordByEmailCommandHandler,
        private readonly _validateForgotKeyForEmailCommandHandler: ValidateForgotKeyForEmailCommandHandler,
        private readonly _resetPasswordByEmailCommandHandler: ResetPasswordByEmailCommandHandler
    ) {}

    @Post('/')
    @OpenAPI({
        description: 'Verify access token by header param or body param.',
        security: []
    })
    async authenticate(@HeaderParam('authorization') authorization: string, @BodyParam('token') token: string) {
        const param = new GetUserAuthByJwtQuery();
        if (authorization) {
            const parts = (authorization || '').split(' ');
            param.token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        }
        else if (token)
            param.token = token;
        return await this._getUserAuthByJwtQueryHandler.handle(param);
    }

    @Post('/login')
    @OpenAPI({
        description: 'Authenticate user by email and password. Applies to any user.',
        security: []
    })
    async login(@BodyParam('email') email: string, @BodyParam('password') password: string) {
        const param = new LoginByEmailQuery();
        param.email = email;
        param.password = password;

        return await this._loginByEmailQueryHandler.handle(param);
    }

    @Post('/forgot-password')
    @OpenAPI({
        description: 'Forgot user\'s password by email.',
        security: []
    })
    async forgotPassword(@BodyParam('email') email: string) {
        const param = new ForgotPasswordByEmailCommand();
        param.email = email;
        return await this._forgotPasswordByEmailCommandHandler.handle(param);
    }

    @Post('/validate-forgot-key')
    @OpenAPI({
        description: 'Validate the forgot key by email and key.',
        security: []
    })
    async validateForgotKey(@BodyParam('forgotKey') forgotKey: string, @BodyParam('email') email: string) {
        const param = new ValidateForgotKeyForEmailCommand();
        param.forgotKey = forgotKey;
        param.email = email;
        return await this._validateForgotKeyForEmailCommandHandler.handle(param);
    }

    @Post('/reset-password')
    @OpenAPI({
        description: 'Reset user\'s password.',
        security: []
    })
    async resetPassword(@BodyParam('forgotKey') forgotKey: string, @BodyParam('email') email: string, @BodyParam('password') password: string) {
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = forgotKey;
        param.email = email;
        param.password = password;

        return await this._resetPasswordByEmailCommandHandler.handle(param);
    }
}
