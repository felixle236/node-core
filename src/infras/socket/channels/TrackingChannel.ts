import { ISocket } from '@shared/socket/interfaces/ISocket';
import { TrackingNS } from '@shared/socket/namespaces/TrackingNS';
import { Server } from 'socket.io';
import { Service } from 'typedi';

@Service()
export default class TrackingChannel {
    init(io: Server): void {
        const nsp = io.of('/' + TrackingNS.NAME);

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
