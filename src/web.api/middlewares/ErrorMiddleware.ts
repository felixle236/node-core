import { DEVELOPMENT_MODE, ENABLE_DATA_LOGGING, ENABLE_WRITE_LOG } from '../../constants/Environments';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import { ILogService } from '../../web.core/interfaces/gateways/logs/ILogService';
import { Inject } from 'typedi';
import { SystemError } from '../../web.core/dtos/common/Exception';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    @Inject('log.service')
    private readonly logService: ILogService;

    // @ts-ignore
    error(err: SystemError, req: Request, res: Response, next: NextFunction) {
        if (ENABLE_DATA_LOGGING)
            console.error({ ...err, stack: err.stack });

        if (ENABLE_WRITE_LOG)
            this.logService.writeLog(JSON.stringify({ ...err, stack: err.stack }));

        // Handle upload error.
        if (err.name === 'MulterError') {
            if (<any>err.code === 'LIMIT_FILE_SIZE')
                err = new SystemError(6);
            else if (<any>err.code === 'LIMIT_FIELD_KEY')
                err = new SystemError(7);
        }

        const error = {
            code: err.code,
            message: err.message
        } as SystemError;

        if (DEVELOPMENT_MODE)
            error.stack = err.stack;

        // Handle internal server error.
        if (!err.code || !err.httpCode) {
            err = new SystemError(2);
            error.code = err.code;
            error.message = err.message;
        }

        res.status(err.httpCode);
        res.send(error);
    }
}
