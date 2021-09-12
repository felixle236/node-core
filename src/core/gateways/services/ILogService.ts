import { Handler } from 'express';

export interface ILogService {
    info(message: string): void;
    info<T>(message: string, meta: T): void;
    info<T>(message: string, meta: T, trace: string): void;

    debug(message: string): void;
    debug<T>(message: string, meta: T): void;
    debug<T>(message: string, meta: T, trace: string): void;

    warn(message: string): void;
    warn<T>(message: string, meta: T): void;
    warn<T>(message: string, meta: T, trace: string): void;

    error(message: string): void;
    error<T>(message: string, meta: T): void;
    error<T>(message: string, meta: T, trace: string): void;

    createMiddleware(): Handler;
}
