import 'shared/types/Global';
import { ILogService } from 'application/interfaces/services/ILogService';
import { Request } from 'express';
import { TraceRequest } from 'shared/request/TraceRequest';
import { mockFunction } from './MockFunction';

export const mockLogService = (): ILogService => {
  return {
    info: mockFunction(),
    debug: mockFunction(),
    warn: mockFunction(),
    error: mockFunction(),
    createMiddleware: mockFunction((req: Request, _res, next) => {
      req.logService = mockLogService();
      req.trace = new TraceRequest();
      req.trace.getFromHttpHeader(req.headers);
      next();
    }),
  };
};
