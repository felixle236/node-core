import { Socket } from 'socket.io';

/**
 * Send data to room
 */
export function send<T>(socket: Socket, event: string, room: string, data: T): boolean {
    return socket.nsp.to(room).emit(event, data);
}

/**
 * Send data to all rooms
 */
export function sendAll<T>(socket: Socket, event: string, data: T): boolean {
    return socket.nsp.emit(event, data);
}

/**
 * Send data to room and sender
 */
export function sendWithSender<T>(socket: Socket, event: string, room: string, data: T): boolean {
    return socket.emit(event, data) && socket.nsp.to(room).emit(event, data);
}

/**
 * Send data to all rooms and sender
 */
export function sendAllWithSender<T>(socket: Socket, event: string, data: T): boolean {
    return socket.emit(event, data) && socket.nsp.emit(event, data);
}

/**
 * Return the ack function when we use emit with ack.
 */
export function ackTimeout(onSuccess: () => void, onTimeout: () => void, timeout: number): () => void {
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
