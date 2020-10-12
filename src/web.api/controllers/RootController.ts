import { Body, JsonController, Post } from 'routing-controllers';
import { ActiveUserCommand } from '../../web.core/interactors/user/commands/active-user/ActiveUserCommand';
import { ActiveUserCommandHandler } from '../../web.core/interactors/user/commands/active-user/ActiveUserCommandHandler';
import { ForgotPasswordCommand } from '../../web.core/interactors/user/commands/forgot-password/ForgotPasswordCommand';
import { ForgotPasswordCommandHandler } from '../../web.core/interactors/user/commands/forgot-password/ForgotPasswordCommandHandler';
import { ResendActivationCommand } from '../../web.core/interactors/user/commands/resend-activation/ResendActivationCommand';
import { ResendActivationCommandHandler } from '../../web.core/interactors/user/commands/resend-activation/ResendActivationCommandHandler';
import { ResetPasswordCommand } from '../../web.core/interactors/user/commands/reset-password/ResetPasswordCommand';
import { ResetPasswordCommandHandler } from '../../web.core/interactors/user/commands/reset-password/ResetPasswordCommandHandler';
import { Service } from 'typedi';
import { SignupCommand } from '../../web.core/interactors/user/commands/signup/SignupCommand';
import { SignupCommandHandler } from '../../web.core/interactors/user/commands/signup/SignupCommandHandler';

@Service()
@JsonController('/v1')
export class RootController {
    constructor(
        private readonly _signupCommandHandler: SignupCommandHandler,
        private readonly _activeUserCommandHandler: ActiveUserCommandHandler,
        private readonly _resendActivationCommandHandler: ResendActivationCommandHandler,
        private readonly _forgotPasswordCommandHandler: ForgotPasswordCommandHandler,
        private readonly _resetPasswordCommandHandler: ResetPasswordCommandHandler
    ) {}

    @Post('/register')
    async register(@Body() param: SignupCommand): Promise<string> {
        return await this._signupCommandHandler.handle(param);
    }

    @Post('/active')
    async active(@Body() param: ActiveUserCommand): Promise<boolean> {
        return await this._activeUserCommandHandler.handle(param);
    }

    @Post('/resend-activation')
    async resendActivation(@Body() param: ResendActivationCommand): Promise<boolean> {
        return await this._resendActivationCommandHandler.handle(param);
    }

    @Post('/forgot-password')
    async forgotPassword(@Body() param: ForgotPasswordCommand): Promise<boolean> {
        return await this._forgotPasswordCommandHandler.handle(param);
    }

    @Post('/reset-password')
    async resetPassword(@Body() param: ResetPasswordCommand): Promise<boolean> {
        return await this._resetPasswordCommandHandler.handle(param);
    }
}
