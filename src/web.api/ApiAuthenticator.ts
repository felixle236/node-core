import { Inject, Service } from 'typedi';
import { Action } from 'routing-controllers';
import { IAuthenticationBusiness } from '../web.core/interfaces/businesses/IAuthenticationBusiness';

@Service('api.authenticator')
export class ApiAuthenticator {
    @Inject('authentication.business')
    private readonly _authBusiness: IAuthenticationBusiness;

    authorizationHttpChecker = async (action: Action, roleIds: number[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        action.request.userAuth = await this._authBusiness.authenticateUser(token, roleIds);
        return !!action.request.userAuth;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
