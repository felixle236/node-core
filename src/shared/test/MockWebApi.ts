/* eslint-disable @typescript-eslint/ban-types */
import { Server } from 'http';
import { ApiService } from 'exposes/api/web/ApiService';
import express, { Request } from 'express';
import { HttpServer } from 'infras/servers/http/HttpServer';
import { useContainer } from 'routing-controllers';
import { i18n } from 'shared/localization/Localization';
import { IRequest } from 'shared/request/IRequest';
import { TraceRequest } from 'shared/request/TraceRequest';
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

    const options = ApiService.getRoutingOptions();
    options.development = true;
    options.controllers = [controller as any];

    const httpServer = new HttpServer();
    return httpServer.start(app, port, options, callback);
};
