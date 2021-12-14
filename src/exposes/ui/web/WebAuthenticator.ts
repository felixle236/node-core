import { Action } from 'routing-controllers';
import { IRequest } from 'shared/request/IRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';

export class WebAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const reqExt = action.request as IRequest;
        if (!reqExt.userAuth || (roleIds && roleIds.length && !roleIds.some(roleId => reqExt.userAuth && roleId === reqExt.userAuth.roleId)))
            return action.response.status(301).redirect('/');
        return true;
    };

    static currentUserChecker = (action: Action): UserAuthenticated | undefined => {
        const reqExt = action.request as IRequest;
        return reqExt.userAuth;
    };
}
