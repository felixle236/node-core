import { Body, HeaderParam, JsonController, Post } from 'routing-controllers';
import { JwtAuthUserQuery } from '../../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { Service } from 'typedi';
import { SigninQuery } from '../../../web.core/usecases/user/queries/signin/SigninQuery';
import { SigninQueryHandler } from '../../../web.core/usecases/user/queries/signin/SigninQueryHandler';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/v1/auth')
export class AuthController {
    constructor(
        private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler,
        private readonly _signinQueryHandler: SigninQueryHandler
    ) {}

    @Post('/')
    async authenticate(@HeaderParam('authorization') token: string): Promise<UserAuthenticated> {
        const parts = (token || '').split(' ');
        const param = new JwtAuthUserQuery();
        param.token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';

        return await this._jwtAuthUserQueryHandler.handle(param);
    }

    @Post('/login')
    async login(@Body() param: SigninQuery): Promise<string> {
        return await this._signinQueryHandler.handle(param);
    }
}
