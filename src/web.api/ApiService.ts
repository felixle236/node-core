import * as compression from 'compression';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { API_PORT } from '../constants/Environments';
import { ApiAuthenticator } from './ApiAuthenticator';
import { Container } from 'typedi';
import { createExpressServer } from 'routing-controllers';

export class ApiService {
    static start(callback?: any): http.Server {
        const authenticator = Container.get<ApiAuthenticator>('api.authenticator');
        const app: express.Express = createExpressServer({
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
        });

        app.use(compression({ filter: /* istanbul ignore next */ (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));
        return app.listen(API_PORT, callback);
    }
}
