import { IRequest } from '@shared/request/IRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryInput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryInput';
import { Action } from 'routing-controllers';
import Container from 'typedi';

export class WebAuthenticator {
    static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const reqExt = action.request as IRequest;
        const token = reqExt.cookies && reqExt.cookies.token;
        const getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
        const param = new GetUserAuthByJwtQueryInput();
        param.token = token;

        const handleOption = new HandleOption();
        handleOption.trace = reqExt.trace;

        const { data } = await getUserAuthByJwtQueryHandler.handle(param, handleOption).catch(() => ({ data: null }));
        if (data && (!roleIds || !roleIds.length || roleIds.some(roleId => roleId === data.roleId)))
            reqExt.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
        return true;
    }

    static currentUserChecker = (action: Action): UserAuthenticated | null => {
        const reqExt = action.request as IRequest;
        return reqExt.userAuth;
    }
}
