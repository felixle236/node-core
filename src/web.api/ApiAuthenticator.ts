import { Action } from 'routing-controllers';
import { AuthenticateUserQuery } from '../web.core/interactors/auth/queries/authenticate-user/AuthenticateUserQuery';
import { AuthenticateUserQueryHandler } from '../web.core/interactors/auth/queries/authenticate-user/AuthenticateUserQueryHandler';
import { Service } from 'typedi';

@Service()
export class ApiAuthenticator {
    constructor(
        private readonly _authenticateUserQueryHandler: AuthenticateUserQueryHandler
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        const param = new AuthenticateUserQuery();
        param.token = token;
        param.roleIds = roleIds;

        action.request.userAuth = await this._authenticateUserQueryHandler.handle(param);
        return !!action.request.userAuth;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
