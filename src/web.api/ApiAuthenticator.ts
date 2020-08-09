import { Inject, Service } from 'typedi';
import { Action } from 'routing-controllers';
import { IAuthenticationInteractor } from '../web.core/interfaces/interactors/IAuthenticationInteractor';

@Service('api.authenticator')
export class ApiAuthenticator {
    @Inject('authentication.interactor')
    private readonly _authInteractor: IAuthenticationInteractor;

    authorizationHttpChecker = async (action: Action, roleIds: number[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        action.request.userAuth = await this._authInteractor.authenticateUser(token, roleIds);
        return !!action.request.userAuth;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
