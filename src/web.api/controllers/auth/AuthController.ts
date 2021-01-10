import { Body, BodyParam, HeaderParam, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';
import { JwtAuthUserQuery } from '../../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { SigninQuery } from '../../../web.core/usecases/user/queries/signin/SigninQuery';
import { SigninQueryHandler } from '../../../web.core/usecases/user/queries/signin/SigninQueryHandler';

@Service()
@JsonController('/v1/auth')
export class AuthController {
    constructor(
        private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler,
        private readonly _signinQueryHandler: SigninQueryHandler
    ) {}

    @Post('/')
    async authenticate(@HeaderParam('authorization') authorization: string, @BodyParam('token') token: string): Promise<UserAuthenticated> {
        const param = new JwtAuthUserQuery();
        if (authorization) {
            const parts = (authorization || '').split(' ');
            param.token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        }
        else if (token)
            param.token = token;

        return await this._jwtAuthUserQueryHandler.handle(param);
    }

    @Post('/login')
    async login(@Body() param: SigninQuery): Promise<UserAuthenticated> {
        return await this._signinQueryHandler.handle(param);
    }
}
