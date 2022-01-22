import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { GetUserAuthByJwtHandler } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { Request } from 'express';
import { Action } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import Container from 'typedi';

export class ApiAuthenticator {
  static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
    const req = action.request as Request;
    const authJwtService = Container.get<IAuthJwtService>(InjectService.AuthJwt);
    const token = authJwtService.getTokenFromHeader(req.headers);
    if (!token) {
      throw new UnauthorizedError();
    }

    const usecaseOption = new UsecaseOption();
    usecaseOption.req = req;
    usecaseOption.tracing = req.tracing;

    const getUserAuthByJwtHandler = Container.get(GetUserAuthByJwtHandler);
    const { data } = await getUserAuthByJwtHandler.handle(token, usecaseOption);
    if (roleIds && roleIds.length && !roleIds.some((roleId) => data && roleId === data.roleId)) {
      throw new AccessDeniedError();
    }

    req.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
    return true;
  };

  static currentUserChecker = (action: Action): UserAuthenticated | undefined => {
    const req = action.request as Request;
    return req.userAuth;
  };
}
