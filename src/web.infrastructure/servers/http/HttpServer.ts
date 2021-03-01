import { Server } from 'http';
import { Express } from 'express';
import { createExpressServer, RoutingControllersOptions, useExpressServer } from 'routing-controllers';

export class HttpServer {
    private _server: Server;
    private _app: Express;

    createApp(options: RoutingControllersOptions, app?: Express) {
        if (app)
            this._app = useExpressServer(app, options);
        else
            this._app = createExpressServer(options);
        return this._app;
    }

    start(port: number, callback?: any): Server {
        this._server = this._app.listen(port, '0.0.0.0', callback);
        return this._server;
    }
}
