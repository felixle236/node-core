import { ILogService } from 'application/interfaces/services/ILogService';
import { IRequest } from 'shared/request/IRequest';
import { TraceRequest } from 'shared/request/TraceRequest';
import { mockFunction } from './MockFunction';

export const mockLogService = (): ILogService => {
    return {
        info: mockFunction(),
        debug: mockFunction(),
        warn: mockFunction(),
        error: mockFunction(),
        createMiddleware: mockFunction((req, _res, next) => {
            const reqExt = req as IRequest;
            reqExt.logService = mockLogService();
            reqExt.trace = new TraceRequest();
            reqExt.trace.getFromHttpHeader(req.headers);
            next();
        })
    };
};
