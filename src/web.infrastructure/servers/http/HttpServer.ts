import { Server } from 'http';
import { Express } from 'express';
import { createExpressServer, RoutingControllersOptions, useExpressServer } from 'routing-controllers';

export class HttpServer {
    app: Express;
    server: Server;

    constructor(options: RoutingControllersOptions, app?: Express) {
        if (app)
            this.app = useExpressServer(app, options);
        else
            this.app = createExpressServer(options);
    }

    start(port: number, callback?: any): Server {
        this.server = this.app.listen(port, '0.0.0.0', callback);
        return this.server;
    }
}
