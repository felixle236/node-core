import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { Action } from 'routing-controllers';
import Container from 'typedi';

export class WebAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        const getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
        const { data } = await getUserAuthByJwtQueryHandler.handle(token).catch(error => {
            action.request.log.error(error);
            return { data: null };
        });

        if (data && (!roleIds || !roleIds.length || roleIds.some(roleId => roleId === data.roleId)))
            action.request.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    }

    static currentUserChecker = (action: Action): UserAuthenticated => {
        return action.request.userAuth;
    }
}
