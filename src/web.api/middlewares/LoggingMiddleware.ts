import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import { ILogService } from '../../web.core/gateways/services/ILogService';
import { IS_DEVELOPMENT } from '../../configs/Configuration';
import { Inject } from 'typedi';

@Middleware({ type: 'before', priority: 2 })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
    @Inject('log.service')
    private readonly _logService: ILogService;

    use(req: Request, _res: Response, next: NextFunction): void {
        if (IS_DEVELOPMENT) {
            this._logService.writeLog({
                type: 'Request',
                method: req.method,
                url: req.originalUrl,
                query: req.query,
                body: req.body
            });
        }
        next();
    }
}
