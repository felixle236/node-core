import { Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { AccessDeniedError } from '../../web.core/domain/common/exceptions/AccessDeniedError';
import { InternalServerError } from '../../web.core/domain/common/exceptions/InternalServerError';
import { SystemError } from '../../web.core/domain/common/exceptions/SystemError';
import { IRequest } from '../../web.core/domain/common/IRequest';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(err: SystemError, req: IRequest, res: Response) {
        // Handle internal server error.
        if (!err.code || !err.httpCode) {
            req.log.error(err.stack || err.message);
            err = new InternalServerError();
        }
        else {
            req.log.warn(err.stack || err.message);
            if (err.httpCode === 403)
                err = new AccessDeniedError();
        }

        res.status(err.httpCode);
        res.render('error', {
            error: {
                code: err.code,
                message: err.message
            }
        });
    }
}
