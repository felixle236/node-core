import * as path from 'path';
import { RedisClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { Container, Service } from 'typedi';
import { DB_SOCKET_HOST, DB_SOCKET_PASSWORD, DB_SOCKET_PORT, DB_SOCKET_PREFIX, SOCKET_PORT } from '../configs/Configuration';
import { getFilesSync } from '../libs/file';
import { SocketServer } from '../web.infrastructure/servers/socket/SocketServer';

@Service()
export class SocketService {
    io: Server;

    setup(): Server {
        // Initalize redis instance
        const pubClient = new RedisClient({
            host: DB_SOCKET_HOST,
            port: DB_SOCKET_PORT,
            password: DB_SOCKET_PASSWORD,
            prefix: DB_SOCKET_PREFIX
        });

        const subClient = pubClient.duplicate();
        this.io = new SocketServer().start(SOCKET_PORT, {
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

        this._initControllers();
        return this.io;
    }

    private _initControllers() {
        const folder = path.join(__dirname, './controllers');
        getFilesSync(folder).forEach(file => {
            const controller = require(`${folder}/${file}`).default;
            const con = Container.get(controller) as any;
            con.init(this.io);
        });
    }
}
