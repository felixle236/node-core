import { Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { AccessDeniedError } from '../../web.core/domain/common/exceptions/AccessDeniedError';
import { SystemError } from '../../web.core/domain/common/exceptions/SystemError';
import { IRequest } from '../../web.core/domain/common/IRequest';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(err: SystemError, req: IRequest, res: Response) {
        if (err.httpCode === 403)
            err = new AccessDeniedError();

        // Handle internal server error.
        if (!err.code || !err.httpCode) {
            req.log.error(err.message, {
                httpRequest: {
                    requestMethod: req.method,
                    requestUrl: req.originalUrl,
                    requestSize: req.get('content-length') ? Number(req.get('content-length')) : 0,
                    userAgent: req.get('user-agent'),
                    remoteIp: req.get('x-forwarded-for') || req.socket.remoteAddress,
                    referer: req.get('referer'),
                    protocol: req.protocol
                },
                stack: err.stack
            });
            err = new SystemError();
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
