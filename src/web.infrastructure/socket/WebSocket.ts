import * as socketIOEmitter from 'socket.io-emitter';
import * as socketIORedis from 'socket.io-redis';
import { Container } from 'typedi';
import { Server } from 'socket.io';
import { WebSocketOptions } from './WebSocketOptions';
import { createSocketServer } from 'socket-controllers';

export class WebSocket {
    server: Server;

    start(options: WebSocketOptions): Server {
        this.server = createSocketServer(options.port, {
            controllers: options.controllerPaths,
            middlewares: options.middlewarePaths
        });

        // Initalize socket adapter
        this.server.adapter(socketIORedis({
            host: options.redisAdapter.host,
            port: options.redisAdapter.port
        }));

        // Initialize socket emitter
        const socketEmitter = socketIOEmitter({
            host: options.redisAdapter.host,
            port: options.redisAdapter.port
        });
        Container.set('socket.io-emitter', socketEmitter);

        return this.server;
    }
}
