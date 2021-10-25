/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { Server } from 'http';
import path from 'path';
import { ApiService } from '@infras/api/ApiService';
import { HttpServer } from '@infras/servers/http/HttpServer';
import i18n from '@shared/localization';
import { IRequest } from '@shared/request/IRequest';
import { TraceRequest } from '@shared/request/TraceRequest';
import express, { Request } from 'express';
import { useContainer } from 'routing-controllers';
import { Container } from 'typeorm-typedi-extensions';
import { mockLogService } from './MockLogService';

export const mockHttpRequest = (req: Request): IRequest => {
    const reqExt = req as IRequest;
    reqExt.logService = mockLogService();
    reqExt.trace = new TraceRequest();
    reqExt.trace.getFromHttpHeader(req.headers);

    return reqExt;
};

export const mockWebApi = (controller: string | Function, port = 3000, callback?: () => void): Server => {
    useContainer(Container);

    const app = express();
    app.use((req: any, _res, next) => {
        mockHttpRequest(req);
        next();
    });
    app.use(i18n.init);

    const options = ApiService.getOptions({
        controllers: [controller as any],
        middlewares: [
            path.join(__dirname, '../../../infras/api/middlewares/*{.js,.ts}')
        ],
        interceptors: [
            path.join(__dirname, '../../../infras/api/interceptors/*{.js,.ts}')
        ],
        development: true
    });

    const httpServer = new HttpServer();
    httpServer.createApp(app, options);
    return httpServer.start(port, callback);
};
