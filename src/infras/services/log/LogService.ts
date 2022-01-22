import { LoggingWinston } from '@google-cloud/logging-winston';
import { ILogService } from 'application/interfaces/services/ILogService';
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY, LOG_PROVIDER, PROJECT_ID } from 'config/Configuration';
import { Handler, NextFunction, Request, Response } from 'express';
import expressWinston from 'express-winston';
import { LogTracing } from 'shared/request/LogTracing';
import { LogProvider } from 'shared/types/Environment';
import { InjectService } from 'shared/types/Injection';
import { Service } from 'typedi';
import { convertObjectToString } from 'utils/Converter';
import { createLogger, format, Logger, transports } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

@Service(InjectService.Log)
export class LogService implements ILogService {
  private readonly _logger: Logger;

  constructor() {
    const { combine, colorize, simple } = format;

    switch (LOG_PROVIDER) {
      case LogProvider.GoogleWinston:
        this._logger = createLogger({
          level: 'debug',
          transports: [
            new LoggingWinston({
              prefix: PROJECT_ID,
            }),
          ],
        });
        break;
      case LogProvider.AwsWinston:
        this._logger = createLogger({
          level: 'debug',
          transports: [
            new WinstonCloudWatch({
              name: PROJECT_ID,
              logGroupName: PROJECT_ID,
              logStreamName: PROJECT_ID,
              awsRegion: AWS_REGION,
              awsAccessKeyId: AWS_ACCESS_KEY,
              awsSecretKey: AWS_SECRET_KEY,
              messageFormatter: ({ level, message, ...meta }) => {
                return level + ': ' + message + (meta && Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '');
              },
            }),
          ],
        });
        break;
      case LogProvider.Winston:
      default:
        this._logger = createLogger({
          level: 'debug',
          transports: [
            new transports.Console({
              format: combine(colorize(), simple()),
            }),
            new transports.File({
              level: 'error',
              filename: process.cwd() + '/logs/error.log',
              maxsize: 10485760,
              maxFiles: 5,
              format: combine(simple()),
            }),
          ],
        });
        break;
    }
  }

  info(message: string, meta?: any, tracing?: LogTracing): void {
    this._logger.info(message + this._formatContent(meta, tracing));
  }

  debug(message: string, meta?: any, tracing?: LogTracing): void {
    this._logger.debug(message + this._formatContent(meta, tracing));
  }

  warn(message: string, meta?: any, tracing?: LogTracing): void {
    this._logger.warn(message + this._formatContent(meta, tracing));
  }

  error(message: string, meta?: any, tracing?: LogTracing): void {
    this._logger.error(message + this._formatContent(meta, tracing));
  }

  private _formatContent(meta?: any, tracing?: LogTracing): string {
    const contents: string[] = [];
    if (meta) {
      if (meta.name === 'Error') {
        meta = { name: meta.name, message: meta.message, stack: meta.stack };
      }
      contents.push(convertObjectToString(meta));
    }
    if (tracing) {
      if (LOG_PROVIDER === LogProvider.GoogleWinston) {
        contents.push(`[${LoggingWinston.LOGGING_TRACE_KEY}: ${tracing.id}]`);
      } else {
        contents.push(`[trace: ${tracing.id}]`);
      }
    }

    if (contents.length) {
      return ' ' + contents.join(' ');
    }
    return '';
  }

  createMiddleware(): Handler {
    let handler: Handler;
    if (LOG_PROVIDER === LogProvider.GoogleWinston) {
      handler = expressWinston.logger({
        transports: [
          new LoggingWinston({
            prefix: PROJECT_ID,
          }),
        ],
        metaField: null, // this causes the metadata to be stored at the root of the log entry
        responseField: null, // this prevents the response from being included in the metadata (including body and status code)
        requestWhitelist: ['headers', 'query'], // these are not included in the standard StackDriver httpRequest
        responseWhitelist: ['body'], // this populates the `res.body` so we can get the response size (not required)
        ignoreRoute: function (req, _res) {
          if (req.path === '/health') {
            return true;
          }
          return false;
        },
        statusLevels: true,
        meta: true,
        dynamicMeta: (req, res) => {
          const httpRequest = {} as any;
          const meta = {} as any;
          if (req) {
            if (!meta[LoggingWinston.LOGGING_TRACE_KEY]) {
              meta[LoggingWinston.LOGGING_TRACE_KEY] = req.tracing.id;
            }

            meta.httpRequest = httpRequest;
            httpRequest.requestMethod = req.method;
            httpRequest.requestUrl = req.url;
            httpRequest.protocol = `HTTP/${req.httpVersion}`;
            httpRequest.remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
            httpRequest.requestSize = req.socket.bytesRead;
            httpRequest.userAgent = req.headers['user-agent'];
            httpRequest.referrer = req.headers.referer;
          }

          if (res) {
            meta.httpRequest = httpRequest;
            httpRequest.status = res.statusCode;
            httpRequest.latency = {
              seconds: (res as any).responseTime / 1000,
              nanos: ((res as any).responseTime % 1000) * 1000000,
            };
            const body = (res as any).body;
            if (body) {
              if (typeof body === 'object') {
                httpRequest.responseSize = JSON.stringify(body).length;
              } else if (typeof body === 'string') {
                httpRequest.responseSize = body.length;
              }
            }
          }
          return meta;
        },
      });
    } else {
      handler = expressWinston.logger({
        winstonInstance: this._logger,
        msg: function (req, res) {
          let responseSize = 0;
          const remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
          const latencySeconds = (res as any).responseTime / 1000;
          const body = (res as any).body;
          if (body) {
            if (typeof body === 'object') {
              responseSize = JSON.stringify(body).length;
            } else if (typeof body === 'string') {
              responseSize = body.length;
            }
          }

          if (LOG_PROVIDER === LogProvider.AwsWinston) {
            return `${remoteIp} ${req.method} ${res.statusCode} ${req.socket.bytesRead}B ${responseSize}B ${latencySeconds}s ${req.url} ${req.headers['user-agent']}`;
          }
          return `[${new Date().toISOString()}]: ${remoteIp} ${req.method} ${res.statusCode} ${req.socket.bytesRead}B ${responseSize}B ${latencySeconds}s ${
            req.url
          } ${req.headers['user-agent']}`;
        },
        metaField: null, // this causes the metadata to be stored at the root of the log entry
        responseField: null, // this prevents the response from being included in the metadata (including body and status code)
        requestWhitelist: ['headers', 'query'], // these are not included in the standard StackDriver httpRequest
        responseWhitelist: ['body'], // this populates the `res.body` so we can get the response size (not required)
        ignoreRoute: function (req, _res) {
          if (req.path === '/health') {
            return true;
          }
          return false;
        },
        statusLevels: true,
        meta: true,
      });
    }

    return (req: Request, res: Response, next: NextFunction) => {
      req.tracing = new LogTracing();
      req.tracing.getFromHttpHeader(req.headers);

      handler(req, res, next);
    };
  }
}
