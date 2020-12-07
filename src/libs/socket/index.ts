import { Socket } from 'socket.io';
import { SocketIOEmitter } from 'socket.io-emitter';

/**
 * Send data to room
 */
export function send(socket: Socket, event: string, room: string, data: any): Boolean {
    return socket.nsp.to(room).emit(event, data);
}

/**
 * Send data to all rooms
 */
export function sendAll(socket: Socket, event: string, data: any): Boolean {
    return socket.nsp.emit(event, data);
}

/**
 * Send data to room and sender
 */
export function sendWithSender(socket: Socket, event: string, room: string, data: any): Boolean {
    return socket.emit(event, data) && socket.nsp.to(room).emit(event, data);
}

/**
 * Send data to all rooms and sender
 */
export function sendAllWithSender(socket: Socket, event: string, data: any): Boolean {
    return socket.emit(event, data) && socket.nsp.emit(event, data);
}

/**
 * Send data to room by emitter
 */
export function sendByEmitter(socketEmitter: SocketIOEmitter, namespace: string, event: string, room: string, data: any): SocketIOEmitter {
    return socketEmitter.of('/' + namespace).to(room).emit(event, data);
}

/**
 * Send data to all rooms by emitter
 */
export function sendAllByEmitter(socketEmitter: SocketIOEmitter, namespace: string, event: string, data: any): SocketIOEmitter {
    return socketEmitter.of('/' + namespace).emit(event, data);
}
