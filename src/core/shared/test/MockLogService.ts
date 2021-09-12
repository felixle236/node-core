/* eslint-disable @typescript-eslint/no-empty-function */
import { ILogService } from '@gateways/services/ILogService';
import { Handler, NextFunction, Request, Response } from 'express';
import { mockHttpRequest } from './MockWebApi';

export const mockLogService = (): ILogService => {
    const logService: any = {
        info() {},
        debug() {},
        warn() {},
        error() {}
    };
    logService.createMiddleware = function(): Handler {
        return (req: Request, _res: Response, next: NextFunction) => {
            mockHttpRequest(req);
            next();
        };
    };
    return logService;
};
