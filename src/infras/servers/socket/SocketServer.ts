import { Server, ServerOptions } from 'socket.io';

export class SocketServer {
  private _server: Server;

  start(port: number, options?: Partial<ServerOptions>): Server {
    this._server = new Server(port, options);
    return this._server;
  }
}
