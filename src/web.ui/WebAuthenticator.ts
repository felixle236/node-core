import { Action } from 'routing-controllers';
import { AuthenticateUserQuery } from '../web.core/interactors/auth/queries/authenticate-user/AuthenticateUserQuery';
import { AuthenticateUserQueryHandler } from '../web.core/interactors/auth/queries/authenticate-user/AuthenticateUserQueryHandler';
import { Service } from 'typedi';

@Service()
export class WebAuthenticator {
    constructor(
        private readonly _authenticateUserQueryHandler: AuthenticateUserQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        if (token) {
            const param = new AuthenticateUserQuery();
            param.token = token;
            param.roleIds = roleIds;
            action.request.userAuth = await this._authenticateUserQueryHandler.handle(param);
        }
        return true;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
