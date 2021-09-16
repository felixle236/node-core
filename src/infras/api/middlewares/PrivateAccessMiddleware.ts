import { API_PRIVATE_KEY } from '@configs/Configuration';
import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { NextFunction } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

export class PrivateAccessMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, _res: Response, next: NextFunction): void {
        if (req.headers['x-private-key'] !== API_PRIVATE_KEY)
            throw new AccessDeniedError();
        next();
    }
}
