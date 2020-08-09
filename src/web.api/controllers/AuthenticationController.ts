import { Body, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IAuthenticationInteractor } from '../../web.core/interfaces/interactors/IAuthenticationInteractor';
import { UserLoginRequest } from '../../web.core/dtos/user/requests/UserLoginRequest';
import { UserLoginSucceedResponse } from '../../web.core/dtos/user/responses/UserLoginSucceedResponse';

@Service()
@JsonController('/auth')
export class AuthenticationController {
    @Inject('authentication.interactor')
    private readonly _authInteractor: IAuthenticationInteractor;

    @Post('/login')
    async login(@Body() data: UserLoginRequest): Promise<UserLoginSucceedResponse> {
        return await this._authInteractor.login(data);
    }
}
