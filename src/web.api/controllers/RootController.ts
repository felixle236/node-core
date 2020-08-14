import { Body, BodyParam, JsonController, Post } from 'routing-controllers';
import { ActiveUserInteractor } from '../../web.core/interactors/user/active-user/Interactor';
import { BooleanResult } from '../../web.core/domain/common/outputs/BooleanResult';
import { ForgotPasswordInteractor } from '../../web.core/interactors/user/forgot-password/Interactor';
import { ResendActivationInteractor } from '../../web.core/interactors/user/resend-activation/Interactor';
import { ResetPasswordInput } from '../../web.core/interactors/user/reset-password/Input';
import { ResetPasswordInteractor } from '../../web.core/interactors/user/reset-password/Interactor';
import { Service } from 'typedi';
import { SignupInput } from '../../web.core/interactors/user/signup/Input';
import { SignupInteractor } from '../../web.core/interactors/user/signup/Interactor';
import { SignupOutput } from '../../web.core/interactors/user/signup/Output';

@Service()
@JsonController()
export class RootController {
    constructor(
        private _signupInteractor: SignupInteractor,
        private _activeUserInteractor: ActiveUserInteractor,
        private _resendActivationInteractor: ResendActivationInteractor,
        private _forgotPasswordInteractor: ForgotPasswordInteractor,
        private _resetPasswordInteractor: ResetPasswordInteractor
    ) {}

    @Post('/register')
    async register(@Body() data: SignupInput): Promise<SignupOutput> {
        return await this._signupInteractor.handle(data);
    }

    @Post('/active')
    async active(@BodyParam('confirmKey') confirmKey: string): Promise<BooleanResult> {
        return await this._activeUserInteractor.handle(confirmKey);
    }

    @Post('/resend-activation')
    async resendActivation(@BodyParam('email') email: string): Promise<BooleanResult> {
        return await this._resendActivationInteractor.handle(email);
    }

    @Post('/forgot-password')
    async forgotPassword(@BodyParam('email') email: string): Promise<BooleanResult> {
        return await this._forgotPasswordInteractor.handle(email);
    }

    @Post('/reset-password')
    async resetPassword(@Body() data: ResetPasswordInput): Promise<BooleanResult> {
        return await this._resetPasswordInteractor.handle(data);
    }
}
