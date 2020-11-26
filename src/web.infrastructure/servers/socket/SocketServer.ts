import * as redis from 'redis';
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
            port: options.redisAdapter.port,
            password: options.redisAdapter.pass,
            prefix: options.redisAdapter.prefix
        });
        const subClient = pubClient.duplicate();
        this.server.adapter(createAdapter({ pubClient, subClient }));

        // Initialize socket emitter
        const redisClient = redis.createClient(options.redisAdapter.port, options.redisAdapter.host, {
            password: options.redisAdapter.pass,
            prefix: options.redisAdapter.prefix
        });
        const socketEmitter = socketIOEmitter(redisClient as any);
        Container.set('socket.io-emitter', socketEmitter);

        return this.server;
    }
}
