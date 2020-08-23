import { Action } from 'routing-controllers';
import { AuthenticateQuery } from '../web.core/interactors/auth/queries/authenticate/AuthenticateQuery';
import { AuthenticateQueryHandler } from '../web.core/interactors/auth/queries/authenticate/AuthenticateQueryHandler';
import { Service } from 'typedi';

@Service()
export class WebAuthenticator {
    constructor(
        private readonly _authenticateQueryHandler: AuthenticateQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        if (token) {
            const param = new AuthenticateQuery();
            param.token = token;
            param.roleIds = roleIds;
            action.request.userAuth = await this._authenticateQueryHandler.handle(param);
        }
        return true;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
