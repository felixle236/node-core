import { ISocketEmitterService } from 'application/interfaces/services/ISocketEmitterService';
import { DB_SOCKET_URI } from 'config/Configuration';
import { createClient } from 'redis';
import { InjectService } from 'shared/types/Injection';
import socketIOEmitter from 'socket.io-emitter';
import { Service } from 'typedi';

@Service(InjectService.SocketEmitter)
export class SocketEmitterService implements ISocketEmitterService {
  private readonly _socketEmitter: socketIOEmitter.SocketIOEmitter;

  constructor() {
    const redisClient = createClient({
      url: DB_SOCKET_URI,
    });

    this._socketEmitter = socketIOEmitter(redisClient as any);
  }

  send<T>(namespace: string, event: string, room: string, data: T): socketIOEmitter.SocketIOEmitter {
    return this._socketEmitter
      .of('/' + namespace)
      .to(room)
      .emit(event, data);
  }

  sendAll<T>(namespace: string, event: string, data: T): socketIOEmitter.SocketIOEmitter {
    return this._socketEmitter.of('/' + namespace).emit(event, data);
  }
}
