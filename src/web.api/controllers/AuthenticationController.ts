import { Body, HeaderParam, JsonController, Post } from 'routing-controllers';
import { AuthenticateUserQuery } from '../../web.core/interactors/auth/queries/authenticate-user/AuthenticateUserQuery';
import { AuthenticateUserQueryHandler } from '../../web.core/interactors/auth/queries/authenticate-user/AuthenticateUserQueryHandler';
import { Service } from 'typedi';
import { SigninQuery } from '../../web.core/interactors/user/queries/signin/SigninQuery';
import { SigninQueryHandler } from '../../web.core/interactors/user/queries/signin/SigninQueryHandler';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/auth')
export class AuthenticationController {
    constructor(
        private readonly _authenticateUserQueryHandler: AuthenticateUserQueryHandler,
        private readonly _signinQueryHandler: SigninQueryHandler
    ) {}

    @Post('/')
    async authenticate(@HeaderParam('authorization') token: string): Promise<UserAuthenticated> {
        const parts = (token || '').split(' ');
        const param = new AuthenticateUserQuery();
        param.token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';

        return await this._authenticateUserQueryHandler.handle(param);
    }

    @Post('/login')
    async login(@Body() param: SigninQuery): Promise<string> {
        return await this._signinQueryHandler.handle(param);
    }
}
