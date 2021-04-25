import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
import { NotificationNS } from '../../web.core/domain/common/socket/namespaces/NotificationNS';

@Service()
export default class NotificationController {
    init(io: Server) {
        const nsp = io.of('/' + NotificationNS.NAME);

        nsp.use((_socket: Socket, next: Function) => {
            // To do something.
            next();
        });

        nsp.on('connection', (socket: Socket) => {
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
