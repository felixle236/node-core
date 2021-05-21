import { Handler } from 'express';

export interface ILogService {
    info(content: string): void;
    info(content: any): void;
    /**
     * Log info for content with metadata.
     * @param meta Must be an object or array.
     */
    info(content: string, meta: any): void;

    debug(content: string): void;
    debug(content: any): void;
    /**
     * Log debug content with metadata.
     * @param meta Must be an object or array.
     */
    debug(content: string, meta: any): void;

    warn(content: string): void;
    warn(content: any): void;
    /**
     * Log warning content with metadata.
     * @param meta Must be an object or array.
     */
    warn(content: string, meta: any): void;

    error(content: string): void;
    error(content: any): void;
    /**
     * Log error content with metadata.
     * @param meta Must be an object or array.
     */
    error(content: string, meta: any): void;

    createMiddleware(): Handler;
}
