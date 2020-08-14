import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { Container } from 'typedi';
import { RoutingControllersOptions } from 'routing-controllers';
import { Server } from 'http';
import { WEB_PORT } from '../constants/Environments';
import { WebAuthenticator } from './WebAuthenticator';
import { WebServer } from '../web.infrastructure/web/WebServer';

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
        const webServer = new WebServer(options);

        // view engine setup
        webServer.app.set('views', path.join(__dirname, 'views'));
        webServer.app.set('view engine', 'ejs');

        webServer.app.use(express.static(path.join(__dirname, 'public')));
        webServer.app.use(cookieParser());

        // catch 404 and forward to error handler
        webServer.app.use(function(_req, res) {
            if (!res.finished) {
                res.status(404);
                res.render('404');
            }
        });

        webServer.app.use(compression({ filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));
        return webServer.start(WEB_PORT, callback);
    }
}
