import { REDIS_CONFIG_HOST, REDIS_CONFIG_PORT, SOCKET_PORT } from '../constants/Environments';
import { WebSocketOptions, WebSocketRedisAdapter } from '../web.infrastructure/socket/WebSocketOptions';
import { controllerPath, middlewarePath } from './SocketModule';
import { WebSocket } from '../web.infrastructure/socket/WebSocket';

export class SocketService {
    setup() {
        const webSocketOptions = new WebSocketOptions();
        webSocketOptions.port = SOCKET_PORT;
        webSocketOptions.redisAdapter = new WebSocketRedisAdapter(REDIS_CONFIG_HOST, REDIS_CONFIG_PORT);
        webSocketOptions.controllerPaths = [controllerPath];
        webSocketOptions.middlewarePaths = [middlewarePath];

        const webSocket = new WebSocket();
        return webSocket.start(webSocketOptions);
    }
}
