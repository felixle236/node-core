import * as socketIOEmitter from 'socket.io-emitter';
import { Container } from 'typedi';
import { RedisClient } from 'redis';
import { Server } from 'socket.io';
import { SocketServerOptions } from './SocketServerOptions';
import { createAdapter } from 'socket.io-redis';
import { createSocketServer } from 'socket-controllers';

export class SocketServer {
    server: Server;

    start(options: SocketServerOptions): Server {
        this.server = createSocketServer(options.port, {
            controllers: options.controllers,
            middlewares: options.middlewares
        });

        // Initalize socket adapter
        const pubClient = new RedisClient({
            host: options.redisAdapter.host,
            port: options.redisAdapter.port
        });
        const subClient = pubClient.duplicate();
        this.server.adapter(createAdapter({ pubClient, subClient }));

        // Initialize socket emitter
        const socketEmitter = socketIOEmitter({
            host: options.redisAdapter.host,
            port: options.redisAdapter.port
        });
        Container.set('socket.io-emitter', socketEmitter);

        return this.server;
    }
}
