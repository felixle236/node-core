import { Handler } from 'express';
import { LogTracing } from 'shared/request/LogTracing';

export interface ILogService {
  info(message: string): void;
  info(message: string, meta: any): void;
  info(message: string, meta: any, trace: LogTracing): void;

  debug(message: string): void;
  debug(message: string, meta: any): void;
  debug(message: string, meta: any, trace: LogTracing): void;

  warn(message: string): void;
  warn(message: string, meta: any): void;
  warn(message: string, meta: any, trace: LogTracing): void;

  error(message: string): void;
  error(message: string, meta: any): void;
  error(message: string, meta: any, trace: LogTracing): void;

  createMiddleware(): Handler;
}
