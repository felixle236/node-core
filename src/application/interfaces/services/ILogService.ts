import { Handler } from 'express';
import { TraceRequest } from 'shared/request/TraceRequest';

export interface ILogService {
  info(message: string): void;
  info(message: string, meta: any): void;
  info(message: string, meta: any, trace: TraceRequest): void;

  debug(message: string): void;
  debug(message: string, meta: any): void;
  debug(message: string, meta: any, trace: TraceRequest): void;

  warn(message: string): void;
  warn(message: string, meta: any): void;
  warn(message: string, meta: any, trace: TraceRequest): void;

  error(message: string): void;
  error(message: string, meta: any): void;
  error(message: string, meta: any, trace: TraceRequest): void;

  createMiddleware(): Handler;
}
