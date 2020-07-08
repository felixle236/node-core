import { Body, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IAuthenticationBusiness } from '../../web.core/interfaces/businesses/IAuthenticationBusiness';
import { UserLoginRequest } from '../../web.core/dtos/user/requests/UserLoginRequest';
import { UserLoginSucceedResponse } from '../../web.core/dtos/user/responses/UserLoginSucceedResponse';

@Service()
@JsonController('/auth')
export class AuthenticationController {
    @Inject('authentication.business')
    private readonly _authBusiness: IAuthenticationBusiness;

    @Post('/login')
    async login(@Body() data: UserLoginRequest): Promise<UserLoginSucceedResponse> {
        return await this._authBusiness.login(data);
    }
}
