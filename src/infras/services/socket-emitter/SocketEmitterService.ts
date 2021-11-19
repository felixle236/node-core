import { ISocketEmitterService } from 'application/interfaces/services/ISocketEmitterService';
import { DB_SOCKET_HOST, DB_SOCKET_PASSWORD, DB_SOCKET_PORT, DB_SOCKET_PREFIX } from 'config/Configuration';
import { RedisClient } from 'redis';
import { InjectService } from 'shared/types/Injection';
import socketIOEmitter from 'socket.io-emitter';
import { Service } from 'typedi';

@Service(InjectService.SocketEmitter)
export class SocketEmitterService implements ISocketEmitterService {
    private readonly _socketEmitter: socketIOEmitter.SocketIOEmitter;

    constructor() {
        const redisClient = new RedisClient({
            host: DB_SOCKET_HOST,
            port: DB_SOCKET_PORT,
            password: DB_SOCKET_PASSWORD,
            prefix: DB_SOCKET_PREFIX
        });

        this._socketEmitter = socketIOEmitter(redisClient as any);
    }

    send<T>(namespace: string, event: string, room: string, data: T): socketIOEmitter.SocketIOEmitter {
        return this._socketEmitter.of('/' + namespace).to(room).emit(event, data);
    }

    sendAll<T>(namespace: string, event: string, data: T): socketIOEmitter.SocketIOEmitter {
        return this._socketEmitter.of('/' + namespace).emit(event, data);
    }
}
