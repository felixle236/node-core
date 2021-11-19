import { WEB_API_PRIVATE_KEY } from 'config/Configuration';
import { NextFunction } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';

export class PrivateAccessMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, _res: Response, next: NextFunction): void {
        if (req.headers['x-private-key'] !== WEB_API_PRIVATE_KEY)
            throw new AccessDeniedError();
        next();
    }
}
