import { Server } from 'http';
import { Express } from 'express';
import { RoutingControllersOptions, useExpressServer } from 'routing-controllers';

export class HttpServer {
    private _server: Server;

    start(app: Express, port: number, options: RoutingControllersOptions, callback?: () => void): Server {
        app = useExpressServer(app, options);
        this._server = app.listen(port, '0.0.0.0', callback);
        return this._server;
    }
}
