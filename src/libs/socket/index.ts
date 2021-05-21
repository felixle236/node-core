import { Socket } from 'socket.io';

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
 * Return the ack function when we use emit with ack.
 */
export function ackTimeout(onSuccess: Function, onTimeout: Function, timeout: number) {
    let isCalled = false;

    const timer = setTimeout(() => {
        if (isCalled) return;
        isCalled = true;
        onTimeout();
    }, timeout);

    return (...args) => {
        if (isCalled) return;
        isCalled = true;
        clearTimeout(timer);
        onSuccess.apply(this, args);
    };
}
