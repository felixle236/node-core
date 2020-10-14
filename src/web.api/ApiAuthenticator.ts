import { Action } from 'routing-controllers';
import { JwtAuthUserQuery } from '../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { Service } from 'typedi';

@Service()
export class ApiAuthenticator {
    constructor(
        private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        const param = new JwtAuthUserQuery();
        param.token = token;
        param.roleIds = roleIds;

        action.request.userAuth = await this._jwtAuthUserQueryHandler.handle(param);
        return !!action.request.userAuth;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
