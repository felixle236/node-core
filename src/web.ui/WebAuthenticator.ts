import { Action } from 'routing-controllers';
import { AuthenticateInput } from '../web.core/interactors/auth/authenticate/Input';
import { AuthenticateInteractor } from '../web.core/interactors/auth/authenticate/Interactor';
import { Service } from 'typedi';

@Service()
export class WebAuthenticator {
    constructor(
        private readonly _authenticateInteractor: AuthenticateInteractor
    ) {}

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        if (token) {
            const param = new AuthenticateInput(token, roleIds);
            action.request.userAuth = await this._authenticateInteractor.handle(param);
        }
        return true;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
