import { Body, BodyParam, JsonController, Post, Put } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IAuthenticationBusiness } from '../../web.core/interfaces/businesses/IAuthenticationBusiness';
import { UserResponse } from '../../web.core/dtos/user/responses/UserResponse';
import { UserSigninRequest } from '../../web.core/dtos/user/requests/UserSigninRequest';
import { UserSigninSucceedResponse } from '../../web.core/dtos/user/responses/UserSigninSucceedResponse';
import { UserSignupRequest } from '../../web.core/dtos/user/requests/UserSignupRequest';

@Service()
@JsonController('/auth')
export class AuthenticationController {
    @Inject('authentication.business')
    private readonly authBusiness: IAuthenticationBusiness;

    @Post('/signin')
    async signin(@Body() data: UserSigninRequest): Promise<UserSigninSucceedResponse> {
        return await this.authBusiness.signin(data);
    }

    @Post('/signup')
    async signup(@Body() data: UserSignupRequest): Promise<UserResponse | undefined> {
        return await this.authBusiness.signup(data);
    }

    @Post('/active')
    async active(@BodyParam('confirmKey') confirmKey: string): Promise<boolean> {
        return await this.authBusiness.active(confirmKey);
    }

    @Post('/resend-activation')
    async resendActivation(@BodyParam('email') email: string): Promise<boolean> {
        return await this.authBusiness.resendActivation(email);
    }

    @Post('/forgot-password')
    async forgotPassword(@BodyParam('email') email: string): Promise<boolean> {
        return await this.authBusiness.forgotPassword(email);
    }

    @Put('/reset-password')
    async resetPassword(@BodyParam('confirmKey') confirmKey: string, @BodyParam('password') password: string): Promise<boolean> {
        return await this.authBusiness.resetPassword(confirmKey, password);
    }
}
