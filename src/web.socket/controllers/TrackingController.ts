import { Server } from 'socket.io';
import { Service } from 'typedi';
import { ISocket } from '../../web.core/domain/common/socket/interfaces/ISocket';
import { TrackingNS } from '../../web.core/domain/common/socket/namespaces/TrackingNS';

@Service()
export default class TrackingController {
    init(io: Server) {
        const nsp = io.of('/' + TrackingNS.NAME);

        nsp.use((_socket: ISocket, next: Function) => {
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
