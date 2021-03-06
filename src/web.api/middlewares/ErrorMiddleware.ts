import { Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { IS_DEVELOPMENT } from '../../configs/Configuration';
import { AccessDeniedError } from '../../web.core/domain/common/exceptions/AccessDeniedError';
import { InternalServerError } from '../../web.core/domain/common/exceptions/InternalServerError';
import { SystemError } from '../../web.core/domain/common/exceptions/SystemError';
import { IRequest } from '../../web.core/domain/common/IRequest';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(err: SystemError, req: IRequest, res: Response) {
        let errLog = err.stack || err.message;
        if (!IS_DEVELOPMENT)
            errLog = errLog.replace(/\n/g, ' ').replace(/\s\s+/g, ' ');

        // Handle internal server error.
        if (!err.code || !err.httpCode) {
            req.log.error(errLog);
            err = new InternalServerError();
        }
        else {
            req.log.warn(errLog);
            if (err.httpCode === 403)
                err = new AccessDeniedError();
        }

        res.status(err.httpCode);
        res.send({
            code: err.code,
            message: err.message
        });
    }
}
