import { Body, BodyParam, HeaderParam, JsonController, Post, Put, Res } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IAuthenticationBusiness } from '../../web.core/interfaces/businesses/IAuthenticationBusiness';
import { Response } from 'express';
import { UserResponse } from '../../web.core/dtos/user/responses/UserResponse';
import { UserSigninRequest } from '../../web.core/dtos/user/requests/UserSigninRequest';
import { UserSigninSucceedResponse } from '../../web.core/dtos/user/responses/UserSigninSucceedResponse';
import { UserSignupRequest } from '../../web.core/dtos/user/requests/UserSignupRequest';

@Service()
@JsonController('/auth')
export class AuthenticationController {
    @Inject('authentication.business')
    private readonly _authBusiness: IAuthenticationBusiness;

    @Post('/authenticate')
    async authenticate(@HeaderParam('authorization') token: string, @Res() res: Response): Promise<boolean> {
        const userAuth = await this._authBusiness.authenticateUser(token);
        res.setHeader('x-user-id', userAuth.id);
        res.setHeader('x-role-id', userAuth.role.id);
        return !!userAuth;
    }

    @Post('/signin')
    async signin(@Body() data: UserSigninRequest): Promise<UserSigninSucceedResponse> {
        return await this._authBusiness.signin(data);
    }

    @Post('/signup')
    async signup(@Body() data: UserSignupRequest): Promise<UserResponse | undefined> {
        return await this._authBusiness.signup(data);
    }

    @Post('/active')
    async active(@BodyParam('confirmKey') confirmKey: string): Promise<boolean> {
        return await this._authBusiness.active(confirmKey);
    }

    @Post('/resend-activation')
    async resendActivation(@BodyParam('email') email: string): Promise<boolean> {
        return await this._authBusiness.resendActivation(email);
    }

    @Post('/forgot-password')
    async forgotPassword(@BodyParam('email') email: string): Promise<boolean> {
        return await this._authBusiness.forgotPassword(email);
    }

    @Put('/reset-password')
    async resetPassword(@BodyParam('confirmKey') confirmKey: string, @BodyParam('password') password: string): Promise<boolean> {
        return await this._authBusiness.resetPassword(confirmKey, password);
    }
}
