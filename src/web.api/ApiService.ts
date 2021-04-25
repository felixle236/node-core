import { Server } from 'http';
import * as path from 'path';
import * as compression from 'compression';
import * as express from 'express';
import { RoutingControllersOptions } from 'routing-controllers';
import * as swaggerUiExpress from 'swagger-ui-express';
import { Container } from 'typedi';
import { ApiAuthenticator } from './ApiAuthenticator';
import { ApiDocument } from './ApiDocument';
import { API_PORT, IS_DEVELOPMENT } from '../configs/Configuration';
import { ILogService } from '../web.core/gateways/services/ILogService';
import { HttpServer } from '../web.infrastructure/servers/http/HttpServer';

export class ApiService {
    setup(callback: any = null): Server {
        const logger = Container.get<ILogService>('log.service');
        const authenticator = Container.get(ApiAuthenticator);
        const app = express();

        app.get('/healthz', (_req, res) => {
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
            validation: false,
            defaultErrorHandler: false,
            development: IS_DEVELOPMENT,
            authorizationChecker: authenticator.authorizationHttpChecker,
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
