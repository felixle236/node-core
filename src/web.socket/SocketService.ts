import * as path from 'path';
import { PROJECT_ID, REDIS_CONFIG_HOST, REDIS_CONFIG_PASS, REDIS_CONFIG_PORT, SOCKET_PORT } from '../configs/Configuration';
import { SocketServerOptions, SocketServerRedisAdapter } from '../web.infrastructure/servers/socket/SocketServerOptions';
import { Server } from 'socket.io';
import { SocketServer } from '../web.infrastructure/servers/socket/SocketServer';

export class SocketService {
    setup(): Server {
        const socketServerOptions = new SocketServerOptions();
        socketServerOptions.port = SOCKET_PORT;
        socketServerOptions.redisAdapter = new SocketServerRedisAdapter(REDIS_CONFIG_HOST, REDIS_CONFIG_PORT, REDIS_CONFIG_PASS, PROJECT_ID);
        socketServerOptions.controllers = [path.join(__dirname, './controllers/*{.js,.ts}')];

        const socketServer = new SocketServer();
        return socketServer.start(socketServerOptions);
    }
}
