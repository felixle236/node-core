import { Inject, Service } from 'typedi';
import { Action } from 'routing-controllers';
import { IAuthenticationInteractor } from '../web.core/interfaces/interactors/IAuthenticationInteractor';

@Service('web.authenticator')
export class WebAuthenticator {
    @Inject('authentication.interactor')
    private readonly _authInteractor: IAuthenticationInteractor;

    authorizationHttpChecker = async (action: Action, roleIds: number[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        if (token)
            action.request.userAuth = await this._authInteractor.authenticateUser(token, roleIds);
        return true;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
