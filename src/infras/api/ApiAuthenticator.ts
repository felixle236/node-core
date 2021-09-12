import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { IRequest } from '@shared/IRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryInput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryInput';
import { Action } from 'routing-controllers';
import Container from 'typedi';

export class ApiAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const reqExt = action.request as IRequest;
        const parts = (reqExt.headers.authorization as string || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        if (!token)
            throw new UnauthorizedError();

        const getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
        const param = new GetUserAuthByJwtQueryInput();
        param.token = token;

        const handleOption = new HandleOption();
        handleOption.trace = reqExt.getTraceHeader();

        const { data } = await getUserAuthByJwtQueryHandler.handle(param, handleOption);
        if (roleIds && roleIds.length && !roleIds.some(roleId => data && roleId === data.roleId))
            throw new AccessDeniedError();

        reqExt.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    }

    static currentUserChecker = (action: Action): UserAuthenticated | null => {
        const reqExt = action.request as IRequest;
        return reqExt.userAuth;
    }
}
