import 'shared/types/Global';
import { ILogService } from 'application/interfaces/services/ILogService';
import { Request } from 'express';
import { LogTracing } from 'shared/request/LogTracing';
import { mockFunction } from './MockFunction';

export const mockLogService = (): ILogService => {
  return {
    info: mockFunction(),
    debug: mockFunction(),
    warn: mockFunction(),
    error: mockFunction(),
    createMiddleware: mockFunction((req: Request, _res, next) => {
      req.tracing = new LogTracing();
      req.tracing.getFromHttpHeader(req.headers);
      next();
    }),
  };
};
