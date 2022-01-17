import { Socket } from 'socket.io';

/**
 * Send data to room
 */
export function send<T>(socket: Socket, event: string, room: string, data: T): boolean {
  return socket.nsp.to(room).emit(event, data);
}

/**
 * Send data to room and sender
 */
export function sendWithSender<T>(socket: Socket, event: string, room: string, data: T): boolean {
  return socket.emit(event, data) && socket.nsp.to(room).emit(event, data);
}

/**
 * Send data to all rooms
 */
export function sendAll<T>(socket: Socket, event: string, data: T): boolean {
  return socket.nsp.emit(event, data);
}
