/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { Server } from 'http';
import path from 'path';
import { HttpServer } from '@infras/servers/http/HttpServer';
import { ApiService } from '@infras/web.api/ApiService';
import express from 'express';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';

export const mockApiService = (controller: string | Function, port = 3000, callback?: () => void): Server => {
    useContainer(Container);

    const app = express();
    app.use((req: any, _res, next) => {
        req.log = {};
        // eslint-disable-next-line no-console
        req.log.log = () => {};
        // eslint-disable-next-line no-console
        req.log.warn = () => {};
        // eslint-disable-next-line no-console
        req.log.error = () => {};
        next();
    });

    const options = ApiService.getOptions({
        controllers: [controller as any],
        middlewares: [
            path.join(__dirname, '../../../infras/web.api/middlewares/*{.js,.ts}')
        ],
        interceptors: [
            path.join(__dirname, '../../../infras/web.api/interceptors/*{.js,.ts}')
        ],
        validation: true,
        development: true
    });

    const httpServer = new HttpServer();
    httpServer.createApp(app, options);
    return httpServer.start(port, callback);
};
