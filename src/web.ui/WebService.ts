import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { Container } from 'typedi';
import { HttpServer } from '../web.infrastructure/servers/http/HttpServer';
import { RoutingControllersOptions } from 'routing-controllers';
import { Server } from 'http';
import { WEB_PORT } from '../constants/Environments';
import { WebAuthenticator } from './WebAuthenticator';

export class WebService {
    setup(callback?: any): Server {
        const authenticator = Container.get(WebAuthenticator);
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
            authorizationChecker: authenticator.authorizationHttpChecker,
            currentUserChecker: authenticator.userAuthChecker
        };
        const httpServer = new HttpServer(options);

        // view engine setup
        httpServer.app.set('views', path.join(__dirname, 'views'));
        httpServer.app.set('view engine', 'ejs');

        httpServer.app.use(express.static(path.join(__dirname, 'public')));
        httpServer.app.use(cookieParser());

        // catch 404 and forward to error handler
        httpServer.app.use(function(_req, res) {
            if (!res.finished) {
                res.status(404);
                res.render('404');
            }
        });

        httpServer.app.use(compression({ filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));
        return httpServer.start(WEB_PORT, callback);
    }
}
