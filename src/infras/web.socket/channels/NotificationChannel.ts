import { ISocket } from '@shared/socket/interfaces/ISocket';
import { NotificationNS } from '@shared/socket/namespaces/NotificationNS';
import { Server } from 'socket.io';
import { Service } from 'typedi';

@Service()
export default class NotificationChannel {
    init(io: Server): void {
        const nsp = io.of('/' + NotificationNS.NAME);

        nsp.use((_socket: ISocket, next: () => void) => {
            // To do something.
            next();
        });

        nsp.on('connection', (socket: ISocket) => {
            // To do something.

            socket.on('disconnecting', () => {
                // To do something else.
            });

            socket.on('disconnect', () => {
                // To do something.
            });
        });
    }
}
