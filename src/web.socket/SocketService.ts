import * as path from 'path';
import * as socketIO from 'socket.io';
import * as socketIOEmitter from 'socket.io-emitter';
import * as socketIORedis from 'socket.io-redis';
import { REDIS_HOST, REDIS_PORT, SOCKET_PORT } from '../constants/Environments';
import { Container } from 'typedi';
import { createSocketServer } from 'socket-controllers';

export class SocketService {
    static start(): socketIO.Server {
        const socketServer: socketIO.Server = createSocketServer(SOCKET_PORT, {
            controllers: [path.join(__dirname, './controllers/*{.js,.ts}')],
            middlewares: [path.join(__dirname, './middlewares/*{.js,.ts}')]
        });

        SocketService.initAdapter(socketServer);
        const socketEmitter = SocketService.initEmitter();
        Container.set('socket.io-emitter', socketEmitter);
        return socketServer;
    }

    static initAdapter(socketServer: socketIO.Server) {
        return socketServer.adapter(socketIORedis({
            host: REDIS_HOST,
            port: REDIS_PORT
        }));
    }

    static initEmitter() {
        return socketIOEmitter({
            host: REDIS_HOST,
            port: REDIS_PORT
        });
    }
}
