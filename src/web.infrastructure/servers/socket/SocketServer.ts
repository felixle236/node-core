import { RedisClient } from 'redis';
import { createSocketServer } from 'socket-controllers';
import { Server } from 'socket.io';
import * as socketIOEmitter from 'socket.io-emitter';
import * as createAdapter from 'socket.io-redis';
import { Container } from 'typedi';
import { SocketServerOptions } from './SocketServerOptions';

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
            port: options.redisAdapter.port,
            password: options.redisAdapter.pass,
            prefix: options.redisAdapter.prefix
        });

        const subClient = pubClient.duplicate();
        this.server.adapter(createAdapter({ pubClient, subClient }));

        // Initialize socket emitter
        const socketEmitter = socketIOEmitter(pubClient as any);
        Container.set('socket.io-emitter', socketEmitter);

        return this.server;
    }
}
