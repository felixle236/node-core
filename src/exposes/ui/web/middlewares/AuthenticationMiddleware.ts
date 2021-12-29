import { GetUserAuthByJwtHandler } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { IRequest } from 'shared/request/IRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import Container from 'typedi';

@Middleware({ type: 'before', priority: 3 })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
    use(req: IRequest, _res: Response, next: NextFunction): void {
        const token = req.cookies && req.cookies.token;
        if (!token)
            return next();

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = req;
        usecaseOption.trace = req.trace;

        const getUserAuthByJwtHandler = Container.get(GetUserAuthByJwtHandler);
        getUserAuthByJwtHandler.handle(token, usecaseOption).then(result => {
            if (result.data)
                req.userAuth = new UserAuthenticated(result.data.userId, result.data.roleId, result.data.type);
            next();
        }).catch(() => next());
    }
}
