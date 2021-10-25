import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { IRequest } from '@shared/request/IRequest';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtHandler } from '@usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { Action } from 'routing-controllers';
import Container from 'typedi';

export class WebAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const reqExt = action.request as IRequest;
        const token = reqExt.cookies && reqExt.cookies.token;
        if (!token)
            throw new UnauthorizedError();

        const usecaseOption = new UsecaseOption();
        usecaseOption.trace = reqExt.trace;

        const getUserAuthByJwtHandler = Container.get(GetUserAuthByJwtHandler);
        const { data } = await getUserAuthByJwtHandler.handle(token, usecaseOption).catch(() => ({ data: null }));
        if (data && (!roleIds || !roleIds.length || roleIds.some(roleId => roleId === data.roleId)))
            reqExt.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    };

    static currentUserChecker = (action: Action): UserAuthenticated | null => {
        const reqExt = action.request as IRequest;
        return reqExt.userAuth;
    };
}
