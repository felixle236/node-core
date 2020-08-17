import { Action } from 'routing-controllers';
import { AuthenticateInput } from '../web.core/interactors/auth/authenticate/Input';
import { AuthenticateInteractor } from '../web.core/interactors/auth/authenticate/Interactor';
import { Service } from 'typedi';

@Service()
export class ApiAuthenticator {
    constructor(
        private readonly _authenticateInteractor: AuthenticateInteractor
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        const param = new AuthenticateInput(token, roleIds);
        action.request.userAuth = await this._authenticateInteractor.handle(param);
        return !!action.request.userAuth;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
