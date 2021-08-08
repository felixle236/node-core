/* eslint-disable @typescript-eslint/no-empty-function */
import { ILogService } from '@gateways/services/ILogService';
import { IRequest } from '@shared/IRequest';
import { Handler, NextFunction, Request, Response } from 'express';

export const mockLogService = (): ILogService => {
    const logger: any = {
        info() {},
        debug() {},
        warn() {},
        error() {}
    };
    logger.createMiddleware = function(): Handler {
        return (req: Request, _res: Response, next: NextFunction) => {
            (req as IRequest).log = logger;
            next();
        };
    };
    return logger;
};
