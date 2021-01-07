import * as path from 'path';
import { Server } from 'socket.io';
import { REDIS_CONFIG_HOST, REDIS_CONFIG_PASSWORD, REDIS_CONFIG_PORT, REDIS_CONFIG_PREFIX, SOCKET_PORT } from '../configs/Configuration';
import { SocketServer } from '../web.infrastructure/servers/socket/SocketServer';
import { SocketServerOptions, SocketServerRedisAdapter } from '../web.infrastructure/servers/socket/SocketServerOptions';

export class SocketService {
    setup(): Server {
        const socketServerOptions = new SocketServerOptions();
        socketServerOptions.port = SOCKET_PORT;
        socketServerOptions.redisAdapter = new SocketServerRedisAdapter(REDIS_CONFIG_HOST, REDIS_CONFIG_PORT, REDIS_CONFIG_PASSWORD, REDIS_CONFIG_PREFIX);
        socketServerOptions.controllers = [path.join(__dirname, './controllers/*{.js,.ts}')];

        const socketServer = new SocketServer();
        return socketServer.start(socketServerOptions);
    }
}
