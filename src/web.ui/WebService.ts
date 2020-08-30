import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { IS_DEVELOPMENT, WEB_PORT } from '../configs/Configuration';
import { Container } from 'typedi';
import { HttpServer } from '../web.infrastructure/servers/http/HttpServer';
import { RoutingControllersOptions } from 'routing-controllers';
import { Server } from 'http';
import { WebAuthenticator } from './WebAuthenticator';

export class WebService {
    setup(callback?: any): Server {
        const authenticator = Container.get(WebAuthenticator);
        const app = express();

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
            development: IS_DEVELOPMENT,
            authorizationChecker: authenticator.authorizationHttpChecker,
            currentUserChecker: authenticator.userAuthChecker
        };
        const httpServer = new HttpServer(options, app);

        // catch 404 and forward to error handler
        httpServer.app.use(function(_req, res) {
            if (!res.writableEnded) {
                res.status(404);
                res.render('404');
            }
        });

        httpServer.app.use(compression({ filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));
        return httpServer.start(WEB_PORT, callback);
    }
}
