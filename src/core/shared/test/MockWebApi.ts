/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { Server } from 'http';
import path from 'path';
import { ApiService } from '@infras/api/ApiService';
import { HttpServer } from '@infras/servers/http/HttpServer';
import express from 'express';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';

export const mockWebApi = (controller: string | Function, port = 3000, callback?: () => void): Server => {
    useContainer(Container);

    const app = express();
    app.use((req: any, _res, next) => {
        req.log = {};
        req.log.log = () => {};
        req.log.warn = () => {};
        req.log.error = () => {};
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
