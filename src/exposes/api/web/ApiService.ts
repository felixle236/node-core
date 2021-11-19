import { Server } from 'http';
import path from 'path';
import { ILogService } from 'application/interfaces/services/ILogService';
import { ENVIRONMENT } from 'config/Configuration';
import express from 'express';
import { HttpServer } from 'infras/servers/http/HttpServer';
import { RoutingControllersOptions } from 'routing-controllers';
import i18n from 'shared/localization';
import { Environment } from 'shared/types/Environment';
import { InjectService } from 'shared/types/Injection';
import Container from 'typedi';
import { ApiAuthenticator } from './ApiAuthenticator';

export class ApiService {
    static init(port: number, callback?: () => void): Server {
        const logger = Container.get<ILogService>(InjectService.Log);
        const app = express();
        app.get('/health', (_req, res) => {
            res.status(200).end('ok');
        });

        const loggingMiddleware = logger.createMiddleware();
        app.use(loggingMiddleware);
        app.use(i18n.init);

        const httpServer = new HttpServer();
        const options = ApiService.getRoutingOptions();
        httpServer.createApp(app, options);
        return httpServer.start(port, callback);
    }

    static getRoutingOptions(): RoutingControllersOptions {
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
            controllers: [
                path.join(__dirname, './controllers/**/*Controller{.js,.ts}')
            ],
            middlewares: [
                path.join(__dirname, './middlewares/*Middleware{.js,.ts}')
            ],
            interceptors: [
                path.join(__dirname, './interceptors/*Interceptor{.js,.ts}')
            ],
            validation: { whitelist: true, validationError: { target: false, value: false } },
            defaultErrorHandler: false,
            development: ENVIRONMENT === Environment.Local,
            authorizationChecker: ApiAuthenticator.authorizationChecker,
            currentUserChecker: ApiAuthenticator.currentUserChecker
        };
    }
}
