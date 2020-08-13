import { Body, HeaderParam, JsonController, Post } from 'routing-controllers';
import { AuthenticateInput } from '../../web.core/interactors/auth/authenticate/Input';
import { AuthenticateInteractor } from '../../web.core/interactors/auth/authenticate/Interactor';
import { Service } from 'typedi';
import { SigninInput } from '../../web.core/interactors/user/signin/Input';
import { SigninInteractor } from '../../web.core/interactors/user/signin/Interactor';
import { SigninOutput } from '../../web.core/interactors/user/signin/Output';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/auth')
export class AuthenticationController {
    constructor(
        private _authenticateInteractor: AuthenticateInteractor,
        private _signinInteractor: SigninInteractor
    ) {}

    @Post('/')
    async authenticate(@HeaderParam('authorization') token: string): Promise<UserAuthenticated> {
        const param = new AuthenticateInput();
        param.accessToken = token;
        return await this._authenticateInteractor.handle(param);
    }

    @Post('/login')
    async login(@Body() data: SigninInput): Promise<SigninOutput> {
        return await this._signinInteractor.handle(data);
    }
}
