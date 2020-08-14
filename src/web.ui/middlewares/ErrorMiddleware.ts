import { ENABLE_DATA_LOGGING, ENABLE_WRITE_LOG, IS_DEVELOPMENT } from '../../constants/Environments';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response } from 'express';
import { ILogService } from '../../web.core/gateways/services/ILogService';
import { Inject } from 'typedi';
import { SystemError } from '../../web.core/domain/common/exceptions';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    @Inject('log.service')
    private readonly _logService: ILogService;

    error(err: SystemError, _req: Request, res: Response) {
        if (ENABLE_DATA_LOGGING)
            console.error({ ...err, stack: err.stack });

        if (ENABLE_WRITE_LOG)
            this._logService.writeLog(JSON.stringify({ ...err, stack: err.stack }));

        const error = {
            code: err.code,
            message: err.message
        } as SystemError;

        if (IS_DEVELOPMENT)
            error.stack = err.stack;

        // Handle internal server error.
        if (!err.code || !err.httpCode) {
            err = new SystemError(2);
            error.code = err.code;
            error.message = err.message;
        }

        res.status(err.httpCode);
        res.render('error', { error });
    }
}
