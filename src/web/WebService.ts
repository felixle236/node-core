import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Container } from 'typedi';
import { WEB_PORT } from '../constants/Environments';
import { WebAuthenticator } from './WebAuthenticator';
import { useExpressServer } from 'routing-controllers';

export class WebService {
    static start(callback?: any): http.Server {
        const authenticator = Container.get<WebAuthenticator>('web.authenticator');
        let app: express.Express = express();

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        app.use(express.static(path.join(__dirname, 'public')));
        app.use(cookieParser());

        app = useExpressServer(app, {
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

        // catch 404 and forward to error handler
        // @ts-ignore
        app.use(function(req, res, next) {
            if (!res.finished) {
                res.status(404);
                res.render('404');
            }
        });

        app.use(compression({ filter: /* istanbul ignore next */ (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));
        return app.listen(WEB_PORT, callback);
    }
}
