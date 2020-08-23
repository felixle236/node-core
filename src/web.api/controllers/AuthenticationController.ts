import { Body, HeaderParam, JsonController, Post } from 'routing-controllers';
import { AuthenticateQuery } from '../../web.core/interactors/auth/queries/authenticate/AuthenticateQuery';
import { AuthenticateQueryHandler } from '../../web.core/interactors/auth/queries/authenticate/AuthenticateQueryHandler';
import { Service } from 'typedi';
import { SigninQuery } from '../../web.core/interactors/user/queries/signin/SigninQuery';
import { SigninQueryHandler } from '../../web.core/interactors/user/queries/signin/SigninQueryHandler';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/auth')
export class AuthenticationController {
    constructor(
        private readonly _authenticateQueryHandler: AuthenticateQueryHandler,
        private readonly _signinQueryHandler: SigninQueryHandler
    ) {}

    @Post('/')
    async authenticate(@HeaderParam('authorization') token: string): Promise<UserAuthenticated> {
        const param = new AuthenticateQuery();
        param.token = token;

        return await this._authenticateQueryHandler.handle(param);
    }

    @Post('/login')
    async login(@Body() param: SigninQuery): Promise<string> {
        return await this._signinQueryHandler.handle(param);
    }
}
