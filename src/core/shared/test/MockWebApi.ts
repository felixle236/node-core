/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { randomUUID } from 'crypto';
import { Server } from 'http';
import path from 'path';
import { ApiService } from '@infras/api/ApiService';
import { HttpServer } from '@infras/servers/http/HttpServer';
import { IRequest } from '@shared/IRequest';
import express, { Request } from 'express';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { mockLogService } from './MockLogService';

export const mockHttpRequest = (req: Request): IRequest => {
    const reqExt = req as IRequest;
    reqExt.logService = mockLogService();
    reqExt.getTraceHeader = () => req.headers['x-trace'] as string;

    if (!req.headers['x-trace'])
        req.headers['x-trace'] = randomUUID();

    return reqExt;
};

export const mockWebApi = (controller: string | Function, port = 3000, callback?: () => void): Server => {
    useContainer(Container);

    const app = express();
    app.use((req: any, _res, next) => {
        mockHttpRequest(req);
        next();
    });

    const options = ApiService.getOptions({
        controllers: [controller as any],
        middlewares: [
            path.join(__dirname, '../../../infras/api/middlewares/*{.js,.ts}')
        ],
        interceptors: [
            path.join(__dirname, '../../../infras/api/interceptors/*{.js,.ts}')
        ],
        validation: true,
        development: true
    });

    const httpServer = new HttpServer();
    httpServer.createApp(app, options);
    return httpServer.start(port, callback);
};
