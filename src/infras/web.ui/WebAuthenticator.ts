import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { Action } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
export class WebAuthenticator {
    @Inject()
    private readonly _getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler;

    authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const token = action.request.cookies && action.request.cookies.token;
        const { data } = await this._getUserAuthByJwtQueryHandler.handle(token).catch(error => {
            action.request.log.error(error);
            return { data: null };
        });

        if (data && (!roleIds || !roleIds.length || roleIds.some(roleId => roleId === data.roleId)))
            action.request.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    }

    userAuthChecker = (action: Action): UserAuthenticated => {
        return action.request.userAuth;
    }
}
