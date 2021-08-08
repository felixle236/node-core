import { Server } from 'http';
import { Express } from 'express';
import { RoutingControllersOptions, useExpressServer } from 'routing-controllers';

export class HttpServer {
    private _server: Server;
    private _app: Express;

    createApp(app: Express, options: RoutingControllersOptions): Express {
        this._app = useExpressServer(app, options);
        return this._app;
    }

    start(port: number, callback?: () => void): Server {
        this._server = this._app.listen(port, '0.0.0.0', callback);
        return this._server;
    }
}
