import * as compression from 'compression';
import * as path from 'path';
import { API_PORT } from '../constants/Environments';
import { ApiAuthenticator } from './ApiAuthenticator';
import { Container } from 'typedi';
import { RoutingControllersOptions } from 'routing-controllers';
import { Server } from 'http';
import { WebServer } from '../web.infrastructure/web/WebServer';

export class ApiService {
    setup(callback?: any): Server {
        const authenticator = Container.get(ApiAuthenticator);
        const options: RoutingControllersOptions = {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
                maxAge: 3600,
                preflightContinue: true,
                optionsSuccessStatus: 204
            },
            routePrefix: '/api/v1',
            controllers: [
                path.join(__dirname, './controllers/*{.js,.ts}')
            ],
            middlewares: [
                path.join(__dirname, './middlewares/*{.js,.ts}')
            ],
            validation: false,
            defaultErrorHandler: false,
            authorizationChecker: authenticator.authorizationHttpChecker,
            currentUserChecker: authenticator.userAuthChecker
        };
        const webServer = new WebServer(options);

        webServer.app.get('/healthz', (_req, res) => {
            res.status(200).end('ok');
        });

        webServer.app.use(compression({ filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));
        return webServer.start(API_PORT, callback);
    }
}
