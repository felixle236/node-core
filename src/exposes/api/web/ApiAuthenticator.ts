import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { GetUserAuthByJwtHandler } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { Action } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { IRequest } from 'shared/request/IRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import Container from 'typedi';

export class ApiAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const reqExt = action.request as IRequest;
        const authJwtService = Container.get<IAuthJwtService>(InjectService.AuthJwt);
        const token = authJwtService.getTokenFromHeader(reqExt.headers);
        if (!token)
            throw new UnauthorizedError();

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = reqExt;
        usecaseOption.trace = reqExt.trace;

        const getUserAuthByJwtHandler = Container.get(GetUserAuthByJwtHandler);
        const { data } = await getUserAuthByJwtHandler.handle(token, usecaseOption);
        if (roleIds && roleIds.length && !roleIds.some(roleId => data && roleId === data.roleId))
            throw new AccessDeniedError();

        reqExt.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    };

    static currentUserChecker = (action: Action): UserAuthenticated | undefined => {
        const reqExt = action.request as IRequest;
        return reqExt.userAuth;
    };
}
