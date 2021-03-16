import { Handler } from 'express';

export interface ILogService {
    info(content: string): void;
    info(content: Object): void;
    info(content: string, meta: any): void;
    info(content: string, ...meta: any[]): void;

    debug(content: string): void;
    debug(content: Object): void;
    debug(content: string, meta: any): void;
    debug(content: string, ...meta: any[]): void;

    warn(content: string): void;
    warn(content: Object): void;
    warn(content: string, meta: any): void;
    warn(content: string, ...meta: any[]): void;

    error(content: string): void;
    error(content: Object): void;
    error(content: string, meta: any): void;
    error(content: string, ...meta: any[]): void;

    createMiddleware(): Handler;
}
