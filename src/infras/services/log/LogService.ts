/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ENVIRONMENT, LOG_PROVIDER, PROJECT_ID } from '@configs/Configuration';
import { Environment, LogProvider } from '@configs/Constants';
import { ILogService } from '@gateways/services/ILogService';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { IRequest } from '@shared/IRequest';
import { convertObjectToString } from '@utils/converter';
import { Handler, NextFunction, Request, Response } from 'express';
import expressWinston from 'express-winston';
import { Service } from 'typedi';
import { createLogger, format, Logger, transports } from 'winston';

@Service('log.service')
export class LogService implements ILogService {
    private readonly _logger: Logger;

    constructor() {
        const { combine, colorize, simple } = format;

        switch (LOG_PROVIDER) {
        case LogProvider.WINSTON:
            this._logger = createLogger({
                level: 'debug',
                transports: [
                    new transports.Console({
                        format: combine(
                            colorize(),
                            simple()
                        )
                    }),
                    new transports.File({
                        level: 'error',
                        filename: process.cwd() + '/logs/error.log',
                        maxsize: 10485760,
                        maxFiles: 5,
                        format: combine(
                            simple()
                        )
                    })
                ]
            });
            break;
        case LogProvider.GOOGLE_WINSTON:
        default:
            this._logger = createLogger({
                level: 'debug',
                transports: [
                    new LoggingWinston({
                        prefix: PROJECT_ID
                    })
                ]
            });
            break;
        }
    }

    info(content: string | any, meta?: any): void {
        this._logger.info(this._formatContent(content), meta);
    }

    debug(content: string | any, meta?: any): void {
        this._logger.debug(this._formatContent(content), meta);
    }

    warn(content: string | any, meta?: any): void {
        this._logger.warn(this._formatContent(content), meta);
    }

    error(content: string | any, meta?: any): void {
        this._logger.error(this._formatContent(content), meta);
    }

    private _formatContent(content: string | any): string {
        if (!content || typeof content === 'string')
            return content;
        if (ENVIRONMENT === Environment.LOCAL)
            return convertObjectToString(content, true);
        return convertObjectToString(content);
    }

    createMiddleware(): Handler {
        let handler: Handler;
        if (LOG_PROVIDER === LogProvider.GOOGLE_WINSTON) {
            handler = expressWinston.logger({
                transports: [
                    new LoggingWinston({
                        prefix: PROJECT_ID
                    })
                ],
                metaField: null, // this causes the metadata to be stored at the root of the log entry
                responseField: null, // this prevents the response from being included in the metadata (including body and status code)
                requestWhitelist: ['headers', 'query'], // these are not included in the standard StackDriver httpRequest
                responseWhitelist: ['body'], // this populates the `res.body` so we can get the response size (not required)
                ignoreRoute: function(req, _res) {
                    if (req.path === '/health' || req.path.startsWith('/docs'))
                        return true;
                    return false;
                },
                statusLevels: true,
                meta: true,
                dynamicMeta: (req, res) => {
                    const httpRequest = {} as any;
                    const meta = {} as any;
                    if (req) {
                        meta.httpRequest = httpRequest;
                        httpRequest.requestMethod = req.method;
                        httpRequest.requestUrl = req.url;
                        httpRequest.protocol = `HTTP/${req.httpVersion}`;
                        httpRequest.remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                        httpRequest.requestSize = req.socket.bytesRead;
                        httpRequest.userAgent = req.get('user-agent');
                        httpRequest.referrer = req.get('referer');
                    }

                    if (res) {
                        meta.httpRequest = httpRequest;
                        httpRequest.status = res.statusCode;
                        httpRequest.latency = {
                            seconds: (res as any).responseTime / 1000,
                            nanos: ((res as any).responseTime % 1000) * 1000000
                        };
                        const body = (res as any).body;
                        if (body) {
                            if (typeof body === 'object')
                                httpRequest.responseSize = JSON.stringify(body).length;
                            else if (typeof body === 'string')
                                httpRequest.responseSize = body.length;
                        }
                    }
                    return meta;
                }
            });
        }
        else {
            handler = expressWinston.logger({
                winstonInstance: this._logger,
                msg: function(req, res) {
                    let responseSize = 0;
                    const remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                    const latencySeconds = (res as any).responseTime / 1000;
                    const body = (res as any).body;
                    if (body) {
                        if (typeof body === 'object')
                            responseSize = JSON.stringify(body).length;
                        else if (typeof body === 'string')
                            responseSize = body.length;
                    }
                    return `[${new Date().toISOString()}]: ${remoteIp} ${req.method} ${res.statusCode} ${req.socket.bytesRead}B ${responseSize}B ${latencySeconds}s ${req.url} ${req.get('user-agent')}`;
                },
                metaField: null, // this causes the metadata to be stored at the root of the log entry
                responseField: null, // this prevents the response from being included in the metadata (including body and status code)
                requestWhitelist: ['headers', 'query'], // these are not included in the standard StackDriver httpRequest
                responseWhitelist: ['body'], // this populates the `res.body` so we can get the response size (not required)
                ignoreRoute: function(req, _res) {
                    if (req.path === '/health' || req.path.startsWith('/docs'))
                        return true;
                    return false;
                },
                statusLevels: true,
                meta: true
            });
        }

        return (req: Request, res: Response, next: NextFunction) => {
            (req as IRequest).log = this._logger;
            handler(req, res, next);
        };
    }
}
