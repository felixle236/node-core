import { Action } from 'routing-controllers';
import { JwtAuthUserQuery } from '../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { Service } from 'typedi';

@Service()
export class WebAuthenticator {
    constructor(
        private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        if (token) {
            const param = new JwtAuthUserQuery();
            param.token = token;
            param.roleIds = roleIds;
            action.request.userAuth = await this._jwtAuthUserQueryHandler.handle(param);
        }
        return true;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
