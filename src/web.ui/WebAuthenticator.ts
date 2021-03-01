import { Action } from 'routing-controllers';
import { Service } from 'typedi';
import { GetUserAuthByJwtQuery } from '../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQuery';
import { GetUserAuthByJwtQueryHandler } from '../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';

@Service()
export class WebAuthenticator {
    constructor(
        private readonly _getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        if (token) {
            const param = new GetUserAuthByJwtQuery();
            param.token = token;
            param.roleIds = roleIds;
            action.request.userAuth = await this._getUserAuthByJwtQueryHandler.handle(param);
        }
        return true;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
