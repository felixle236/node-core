import { Action } from 'routing-controllers';
import { AuthenticateQuery } from '../web.core/interactors/auth/queries/authenticate/AuthenticateQuery';
import { AuthenticateQueryHandler } from '../web.core/interactors/auth/queries/authenticate/AuthenticateQueryHandler';
import { Service } from 'typedi';

@Service()
export class ApiAuthenticator {
    constructor(
        private readonly _authenticateQueryHandler: AuthenticateQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        const param = new AuthenticateQuery();
        param.token = token;
        param.roleIds = roleIds;

        action.request.userAuth = await this._authenticateQueryHandler.handle(param);
        return !!action.request.userAuth;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
