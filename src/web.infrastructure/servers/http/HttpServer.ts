import { RoutingControllersOptions, createExpressServer } from 'routing-controllers';
import { Express } from 'express';
import { Server } from 'http';

export class HttpServer {
    app: Express;
    server: Server;

    constructor(options: RoutingControllersOptions) {
        this.app = createExpressServer(options);
    }

    start(port: number, callback?: any): Server {
        this.server = this.app.listen(port, '0.0.0.0', callback);
        return this.server;
    }
}
