import path from 'path';
import { DB_SOCKET_HOST, DB_SOCKET_PASSWORD, DB_SOCKET_PORT, DB_SOCKET_PREFIX } from 'config/Configuration';
import { SocketServer } from 'infras/servers/socket/SocketServer';
import { RedisClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { Container } from 'typedi';
import { getFilesSync } from 'utils/File';

export class SocketService {
    static io: Server;

    static init(port: number): Server {
        // Initalize redis instance
        const pubClient = new RedisClient({
            host: DB_SOCKET_HOST,
            port: DB_SOCKET_PORT,
            password: DB_SOCKET_PASSWORD,
            prefix: DB_SOCKET_PREFIX
        });

        const subClient = pubClient.duplicate();
        this.io = new SocketServer().start(port, {
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

        this._initChannels();
        return this.io;
    }

    private static _initChannels(): void {
        const folder = path.join(__dirname, './channels');
        for (const file of getFilesSync(folder)) {
            if (!file.includes('.spec')) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const controller = require(`${folder}/${file}`).default;
                const con = Container.get(controller) as { init: (io: Server) => void};
                con.init(this.io);
            }
        }
    }
}
