import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import { ILogService } from '../../web.core/gateways/services/ILogService';
import { Inject } from 'typedi';

@Middleware({ type: 'before' })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
    @Inject('log.service')
    private readonly _logService: ILogService;

    use(req: Request, _res: Response, next: NextFunction): void {
        this._logService.writeLog({
            type: 'request',
            method: req.method,
            url: req.originalUrl,
            query: JSON.stringify(req.query, null, 2),
            body: req.body
        });
        next();
    }
}
