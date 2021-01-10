import { Server, ServerOptions } from 'socket.io';

export class SocketServer {
    server: Server;

    start(port: number, options?: ServerOptions): Server {
        this.server = new Server(port, options);
        return this.server;
    }
}
