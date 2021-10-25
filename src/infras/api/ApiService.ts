/* eslint-disable @typescript-eslint/ban-types */
import { Server } from 'http';
import path from 'path';
import { ENVIRONMENT } from '@configs/Configuration';
import { Environment } from '@configs/Enums';
import { ILogService } from '@gateways/services/ILogService';
import { HttpServer } from '@infras/servers/http/HttpServer';
import i18n from '@shared/localization';
import { ValidatorOptions } from 'class-validator';
import express from 'express';
import { RoutingControllersOptions } from 'routing-controllers';
import swaggerUiExpress from 'swagger-ui-express';
import Container from 'typedi';
import { ApiAuthenticator } from './ApiAuthenticator';
import { ApiDocument } from './ApiDocument';

export class ApiService {
    static init(port: number, callback?: () => void): Server {
        const logger = Container.get<ILogService>('log.service');
        const app = express();

        app.get('/health', (_req, res) => {
            res.status(200).end('ok');
        });

        const loggingMiddleware = logger.createMiddleware();
        app.use(loggingMiddleware);
        app.use(i18n.init);

        const options = this.getOptions({
            controllers: [
                path.join(__dirname, './controllers/**/*Controller{.js,.ts}')
            ],
            middlewares: [
                path.join(__dirname, './middlewares/*Middleware{.js,.ts}')
            ],
            interceptors: [
                path.join(__dirname, './interceptors/*Interceptor{.js,.ts}')
            ],
            development: ENVIRONMENT === Environment.Local
        });

        const httpServer = new HttpServer();
        httpServer.createApp(app, options);

        const spec = ApiDocument.generate(options);
        app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

        return httpServer.start(port, callback);
    }

    static getOptions(param: {
        controllers?: string[] | Function[],
        middlewares?: string[] | Function[],
        interceptors?: string[] | Function[],
        validation?: ValidatorOptions,
        development: boolean
    }): RoutingControllersOptions {
        return {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Trace'],
                maxAge: 3600,
                preflightContinue: true,
                optionsSuccessStatus: 204
            },
            routePrefix: '/api',
            controllers: param.controllers,
            middlewares: param.middlewares,
            interceptors: param.interceptors,
            validation: param.validation || { whitelist: true, validationError: { target: false, value: false } },
            defaultErrorHandler: false,
            development: param.development,
            authorizationChecker: ApiAuthenticator.authorizationChecker,
            currentUserChecker: ApiAuthenticator.currentUserChecker
        };
    }
}
