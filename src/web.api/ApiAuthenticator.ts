import { Action } from 'routing-controllers';
import { Service } from 'typedi';
import { GetUserAuthByJwtQuery } from '../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQuery';
import { GetUserAuthByJwtQueryHandler } from '../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';

@Service()
export class ApiAuthenticator {
    constructor(
        private readonly _getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        const param = new GetUserAuthByJwtQuery();
        param.token = token;
        param.roleIds = roleIds;

        action.request.userAuth = await this._getUserAuthByJwtQueryHandler.handle(param);
        return !!action.request.userAuth;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
