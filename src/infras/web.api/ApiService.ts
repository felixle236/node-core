import { Server } from 'http';
import path from 'path';
import { API_PORT, ENVIRONMENT } from '@configs/Configuration';
import { Environment } from '@configs/Constants';
import { ILogService } from '@gateways/services/ILogService';
import { HttpServer } from '@infras/servers/http/HttpServer';
import compression from 'compression';
import express from 'express';
import { RoutingControllersOptions } from 'routing-controllers';
import swaggerUiExpress from 'swagger-ui-express';
import Container from 'typedi';
import { ApiAuthenticator } from './ApiAuthenticator';
import { ApiDocument } from './ApiDocument';

export class ApiService {
    static init(callback?: () => void): Server {
        const logger = Container.get<ILogService>('log.service');
        const authenticator = Container.get(ApiAuthenticator);
        const app = express();

        app.get('/health', (_req, res) => {
            res.status(200).end('ok');
        });

        const loggingMiddleware = logger.createMiddleware();
        app.use(loggingMiddleware);

        const options: RoutingControllersOptions = {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
                maxAge: 3600,
                preflightContinue: true,
                optionsSuccessStatus: 204
            },
            routePrefix: '/api',
            controllers: [
                path.join(__dirname, './controllers/**/*{.js,.ts}')
            ],
            middlewares: [
                path.join(__dirname, './middlewares/*{.js,.ts}')
            ],
            interceptors: [
                path.join(__dirname, './interceptors/*{.js,.ts}')
            ],
            validation: true,
            defaultErrorHandler: false,
            development: ENVIRONMENT === Environment.LOCAL,
            authorizationChecker: authenticator.authorizationChecker,
            currentUserChecker: authenticator.userAuthChecker
        };
        const httpServer = new HttpServer();
        httpServer.createApp(options, app);

        const spec = new ApiDocument(options).generate();
        app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
        app.use(compression({ filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));

        return httpServer.start(API_PORT, callback);
    }
}
