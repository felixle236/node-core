import { express, LoggingWinston } from '@google-cloud/logging-winston';
import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import * as winston from 'winston';
import { LOG_PROVIDER, PROJECT_ID } from '../../../configs/Configuration';
import { LogProvider } from '../../../configs/ServiceProvider';
import { IRequest } from '../../../web.core/domain/common/IRequest';
import { ILogService } from '../../../web.core/gateways/services/ILogService';

@Service('log.service')
export class LogService implements ILogService {
    private readonly _logger: winston.Logger;

    constructor() {
        const { combine, timestamp, label, printf, colorize } = winston.format;

        switch (LOG_PROVIDER) {
        case LogProvider.GOOGLE_WINSTON:
            this._logger = winston.createLogger({
                level: 'info',
                transports: [
                    new LoggingWinston()
                ]
            });
            break;
        case LogProvider.WINSTON:
        default:
            this._logger = winston.createLogger({
                level: 'info',
                transports: [
                    new winston.transports.Console({
                        format: combine(
                            label({ label: PROJECT_ID }),
                            timestamp(),
                            colorize(),
                            printf((info: winston.Logform.TransformableInfo) => {
                                const meta = { ...info } as any;
                                const { timestamp, label, level, message } = info;

                                delete meta.timestamp;
                                delete meta.label;
                                delete meta.level;
                                delete meta.message;

                                return `\n${timestamp} [${label}] ${level}: ${message} ${Object.keys(meta).length ? '\n' + JSON.stringify(meta, undefined, 2).replace(/\n/g, '').replace(/\s\s+/g, ' ') + '\n' : ''}`;
                            })
                        )
                    }),
                    new winston.transports.File({
                        level: 'error',
                        filename: process.cwd() + '/logs/error.log',
                        maxsize: 10485760,
                        maxFiles: 5,
                        format: combine(
                            label({ label: PROJECT_ID }),
                            timestamp(),
                            printf((info: winston.Logform.TransformableInfo) => {
                                return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} ${JSON.stringify(info, undefined, 2).replace(/\n/g, '').replace(/\s\s+/g, ' ')}`;
                            })
                        )
                    })
                ]
            });
            break;
        }
    }

    info(content: string | Object, meta?: any | any[]) {
        if (typeof content === 'string')
            this._logger.info(content, meta);
        else
            this._logger.info(content);
    }

    warn(content: string | Object, meta?: any | any[]) {
        if (typeof content === 'string')
            this._logger.warn(content, meta);
        else
            this._logger.warn(content);
    }

    error(content: string | Object, meta?: any | any[]) {
        if (typeof content === 'string')
            this._logger.error(content, meta);
        else
            this._logger.error(content);
    }

    async createMiddleware(): Promise<(req: Request, res: Response, next: NextFunction)=> void> {
        if (LOG_PROVIDER === LogProvider.GOOGLE_WINSTON)
            return await express.makeMiddleware(this._logger);

        return (req: Request, _res: Response, next: NextFunction) => {
            (req as IRequest).log = this._logger;
            this._logger.info(`${req.method} ${req.originalUrl}`, {
                httpRequest: {
                    requestMethod: req.method,
                    requestUrl: req.originalUrl,
                    requestSize: req.get('content-length') ? Number(req.get('content-length')) : 0,
                    userAgent: req.get('user-agent'),
                    remoteIp: req.get('x-forwarded-for') || req.socket.remoteAddress,
                    referer: req.get('referer'),
                    protocol: req.protocol
                }
            });
            next();
        };
    }
}
