import { Server } from 'http';
import path from 'path';
import { ENVIRONMENT, WEB_PORT } from '@configs/Configuration';
import { Environment } from '@configs/Constants';
import { ILogService } from '@gateways/services/ILogService';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import { RoutingControllersOptions } from 'routing-controllers';
import { Container } from 'typedi';
import { WebAuthenticator } from './WebAuthenticator';
import { HttpServer } from '../servers/http/HttpServer';

export class WebService {
    static init(callback?: () => void): Server {
        const logger = Container.get<ILogService>('log.service');
        const authenticator = Container.get(WebAuthenticator);
        const app = express();

        const loggingMiddleware = logger.createMiddleware();
        app.use(loggingMiddleware);

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        app.use(express.static(path.join(__dirname, 'public')));
        app.use(cookieParser());

        const options: RoutingControllersOptions = {
            controllers: [
                path.join(__dirname, './controllers/*{.js,.ts}')
            ],
            middlewares: [
                path.join(__dirname, './middlewares/*{.js,.ts}')
            ],
            interceptors: [
                path.join(__dirname, './interceptors/*{.js,.ts}')
            ],
            validation: false,
            defaultErrorHandler: false,
            development: ENVIRONMENT === Environment.LOCAL,
            authorizationChecker: authenticator.authorizationChecker,
            currentUserChecker: authenticator.userAuthChecker
        };

        const httpServer = new HttpServer();
        httpServer.createApp(options, app);

        app.use(compression({ filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));
        // catch 404 and forward to error handler
        app.use(function(_req, res) {
            if (!res.writableEnded) {
                res.status(404);
                res.render('404');
            }
        });

        return httpServer.start(WEB_PORT, callback);
    }
}
