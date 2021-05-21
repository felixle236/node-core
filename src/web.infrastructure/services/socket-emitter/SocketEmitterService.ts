import { RedisClient } from 'redis';
import * as socketIOEmitter from 'socket.io-emitter';
import { Service } from 'typedi';
import { DB_SOCKET_HOST, DB_SOCKET_PASSWORD, DB_SOCKET_PORT, DB_SOCKET_PREFIX } from '../../../configs/Configuration';
import { ISocketEmitterService } from '../../../web.core/gateways/services/ISocketEmitterService';

@Service('socket_emitter.service')
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

    send(namespace: string, event: string, room: string, data: any): socketIOEmitter.SocketIOEmitter {
        return this._socketEmitter.of('/' + namespace).to(room).emit(event, data);
    }

    sendAll(namespace: string, event: string, data: any): socketIOEmitter.SocketIOEmitter {
        return this._socketEmitter.of('/' + namespace).emit(event, data);
    }
}
