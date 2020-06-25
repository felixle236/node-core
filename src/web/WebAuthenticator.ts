import { Inject, Service } from 'typedi';
import { Action } from 'routing-controllers';
import { IAuthenticationBusiness } from '../web.core/interfaces/businesses/IAuthenticationBusiness';

@Service('web.authenticator')
export class WebAuthenticator {
    @Inject('authentication.business')
    private readonly _authBusiness: IAuthenticationBusiness;

    authorizationHttpChecker = async (action: Action, claims: number[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        if (token)
            action.request.userAuth = await this._authBusiness.authenticateUser(token, claims);
        return true;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}
