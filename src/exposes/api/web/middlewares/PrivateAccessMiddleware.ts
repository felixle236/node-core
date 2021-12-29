import { WEB_API_PRIVATE_KEY } from 'config/Configuration';
import { NextFunction } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { HttpHeaderKey } from 'shared/types/Common';

export class PrivateAccessMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, _res: Response, next: NextFunction): void {
        if (req.headers[HttpHeaderKey.PrivateKey] !== WEB_API_PRIVATE_KEY)
            throw new AccessDeniedError();
        next();
    }
}
