import { SocketIOEmitter } from 'socket.io-emitter';

export interface ISocketEmitterService {
    /**
     * Send data to room into namespace.
     */
    send(namespace: string, event: string, room: string, data: any): SocketIOEmitter;

    /**
     * Send data to all rooms into namespace.
     */
    sendAll(namespace: string, event: string, data: any): SocketIOEmitter;
}
