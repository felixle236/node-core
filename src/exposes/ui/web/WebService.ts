import { Server } from 'http';
import path from 'path';
import { ILogService } from 'application/interfaces/services/ILogService';
import { ENVIRONMENT } from 'config/Configuration';
import cookieParser from 'cookie-parser';
import express from 'express';
import { HttpServer } from 'infras/servers/http/HttpServer';
import { RoutingControllersOptions } from 'routing-controllers';
import i18n from 'shared/localization';
import { Environment } from 'shared/types/Environment';
import { InjectService } from 'shared/types/Injection';
import { Container } from 'typedi';
import { WebAuthenticator } from './WebAuthenticator';

export class WebService {
    static init(port: number, callback?: () => void): Server {
        const logger = Container.get<ILogService>(InjectService.Log);
        const app = express();
        const loggingMiddleware = logger.createMiddleware();
        app.use(loggingMiddleware);
        app.use(i18n.init);

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        app.use(express.static(path.join(__dirname, 'public')));
        app.use(cookieParser());

        const httpServer = new HttpServer();
        const options = WebService.getRoutingOptions();
        httpServer.createApp(app, options);

        // catch 404 and forward to error handler
        app.use(function(_req, res) {
            if (!res.writableEnded) {
                res.status(404);
                res.render('404');
            }
        });

        return httpServer.start(port, callback);
    }

    static getRoutingOptions(): RoutingControllersOptions {
        return {
            controllers: [
                path.join(__dirname, './controllers/*Controller{.js,.ts}')
            ],
            middlewares: [
                path.join(__dirname, './middlewares/*Middleware{.js,.ts}')
            ],
            interceptors: [
                path.join(__dirname, './interceptors/Interceptor*{.js,.ts}')
            ],
            validation: { whitelist: true, validationError: { target: false, value: false } },
            defaultErrorHandler: false,
            development: ENVIRONMENT === Environment.Local,
            authorizationChecker: WebAuthenticator.authorizationChecker,
            currentUserChecker: WebAuthenticator.currentUserChecker
        };
    }
}
