import * as path from 'path';
import { RedisClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';
import * as socketIOEmitter from 'socket.io-emitter';
import { createAdapter } from 'socket.io-redis';
import { Container, Service } from 'typedi';
import { REDIS_CONFIG_HOST, REDIS_CONFIG_PASSWORD, REDIS_CONFIG_PORT, REDIS_CONFIG_PREFIX, SOCKET_PORT } from '../configs/Configuration';
import { getFilesSync } from '../libs/file';
import { SocketServer } from '../web.infrastructure/servers/socket/SocketServer';

@Service()
export class SocketService {
    io: Server;

    setup(): Server {
        // Initalize redis instance
        const pubClient = new RedisClient({
            host: REDIS_CONFIG_HOST,
            port: REDIS_CONFIG_PORT,
            password: REDIS_CONFIG_PASSWORD,
            prefix: REDIS_CONFIG_PREFIX
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

        // Initialize socket emitter
        const socketEmitter = socketIOEmitter(pubClient as any);
        Container.set('socket.io-emitter', socketEmitter);

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
