import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { Action } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
export class ApiAuthenticator {
    @Inject()
    private readonly _getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler;

    authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';

        const { data } = await this._getUserAuthByJwtQueryHandler.handle(token);
        if (roleIds && roleIds.length && !roleIds.some(roleId => roleId === data.roleId))
            throw new AccessDeniedError();

        action.request.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    }

    userAuthChecker = (action: Action): UserAuthenticated => {
        return action.request.userAuth;
    }
}
