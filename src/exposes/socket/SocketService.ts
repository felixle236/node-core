import path from 'path';
import { createAdapter } from '@socket.io/redis-adapter';
import { SOCKET_REDIS_URI } from 'config/Configuration';
import { SocketServer } from 'infras/servers/socket/SocketServer';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { Container } from 'typedi';
import { searchFilesSync } from 'utils/File';

export class SocketService {
  static io: Server;

  static init(port: number): Server {
    // Initalize redis instance
    const pubClient = createClient({
      url: SOCKET_REDIS_URI,
    });

    const subClient = pubClient.duplicate();
    this.io = new SocketServer().start(port, {
      cors: {
        origin: '*',
        preflightContinue: true,
        optionsSuccessStatus: 204,
      },
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      adapter: createAdapter(pubClient, subClient),
    });

    this._initChannels();
    return this.io;
  }

  private static _initChannels(): void {
    const files = searchFilesSync(path.join(__dirname, './channels/**/*Channel{.js,.ts}'));
    for (const file of files) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const controller = require(file).default;
      const con = Container.get(controller) as { init: (io: Server) => void };
      con.init(this.io);
    }
  }
}
