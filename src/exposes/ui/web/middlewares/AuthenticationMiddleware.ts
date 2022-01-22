import { GetUserAuthByJwtHandler } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { NextFunction, Request } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import Container from 'typedi';

@Middleware({ type: 'before', priority: 3 })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, _res: Response, next: NextFunction): void {
    const token = req.cookies && req.cookies.token;
    if (!token) {
      return next();
    }

    const usecaseOption = new UsecaseOption();
    usecaseOption.req = req;
    usecaseOption.tracing = req.tracing;

    const getUserAuthByJwtHandler = Container.get(GetUserAuthByJwtHandler);
    getUserAuthByJwtHandler
      .handle(token, usecaseOption)
      .then((result) => {
        if (result.data) {
          req.userAuth = new UserAuthenticated(result.data.userId, result.data.roleId, result.data.type);
        }
        next();
      })
      .catch(() => next());
  }
}
