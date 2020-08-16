import * as path from 'path';
import { REDIS_CONFIG_HOST, REDIS_CONFIG_PORT, SOCKET_PORT } from '../configs/Configuration';
import { SocketServerOptions, SocketServerRedisAdapter } from '../web.infrastructure/servers/socket/SocketServerOptions';
import { Server } from 'socket.io';
import { SocketServer } from '../web.infrastructure/servers/socket/SocketServer';

export class SocketService {
    setup(): Server {
        const socketServerOptions = new SocketServerOptions();
        socketServerOptions.port = SOCKET_PORT;
        socketServerOptions.redisAdapter = new SocketServerRedisAdapter(REDIS_CONFIG_HOST, REDIS_CONFIG_PORT);

        const controllerPath = path.join(__dirname, './controllers');
        socketServerOptions.controllerPaths = [controllerPath];

        const socketServer = new SocketServer();
        return socketServer.start(socketServerOptions);
    }
}
