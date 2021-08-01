import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { Action } from 'routing-controllers';
import Container from 'typedi';

export class ApiAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';

        const getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
        const { data } = await getUserAuthByJwtQueryHandler.handle(token);
        if (roleIds && roleIds.length && !roleIds.some(roleId => data && roleId === data.roleId))
            throw new AccessDeniedError();

        action.request.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    }

    static currentUserChecker = (action: Action): UserAuthenticated => {
        return action.request.userAuth;
    }
}
