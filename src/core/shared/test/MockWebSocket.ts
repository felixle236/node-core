import { SocketServer } from '@infras/servers/socket/SocketServer';
import { RedisClient } from 'redis-mock';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';

export const mockWebSocket = (port = 5000): Server => {
    const pubClient = new RedisClient({});
    const subClient = pubClient.duplicate();
    const io = new SocketServer().start(port, {
        cors: {
            origin: '*',
            preflightContinue: true,
            optionsSuccessStatus: 204
        },
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
        adapter: createAdapter({ pubClient, subClient })
    } as ServerOptions);

    return io;
};
