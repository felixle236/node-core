import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
import { SocketNamespace } from '../../web.core/domain/common/socket/SocketNamespace';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';
import { RoleId } from '../../web.core/domain/enums/role/RoleId';
import { GetUserAuthByJwtQuery } from '../../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQuery';
import { GetUserAuthByJwtQueryHandler } from '../../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { UpdateUserOnlineStatusCommand } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommand';
import { UpdateUserOnlineStatusCommandHandler } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandHandler';

@Service()
export default class MessageController {
    constructor(
        private readonly _getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler,
        private readonly _updateUserOnlineStatusCommandHandler: UpdateUserOnlineStatusCommandHandler
    ) {}

    init(io: Server) {
        const nsp = io.of('/' + SocketNamespace.MESSAGE.NAME);

        // Ensure the socket is authorized
        nsp.use(async (socket: Socket, next: Function) => {
            try {
                const param = new GetUserAuthByJwtQuery();
                param.token = (socket.handshake.auth as {token: string}).token;
                const userAuth = await this._getUserAuthByJwtQueryHandler.handle(param);
                (socket as any).userAuth = userAuth;
                next();
            }
            catch (error) {
                next(error);
            }
        });

        nsp.on('connection', async (socket: Socket) => {
            const userAuth = (socket as any).userAuth as UserAuthenticated;

            const param = new UpdateUserOnlineStatusCommand();
            param.id = userAuth.userId;
            param.isOnline = true;
            param.onlineAt = new Date();

            const hasSucceed = await this._updateUserOnlineStatusCommandHandler.handle(param);
            if (hasSucceed && userAuth.roleId !== RoleId.SUPER_ADMIN)
                socket.nsp.emit(SocketNamespace.MESSAGE.EVENTS.USER_ONLINE_STATUS_CHANGED, param);

            socket.join(userAuth.roleId);
            socket.join(userAuth.userId);

            socket.on('disconnecting', () => {
                // To do something else.
            });

            socket.on('disconnect', async () => {
                const param = new UpdateUserOnlineStatusCommand();
                param.id = userAuth.userId;
                param.isOnline = false;
                param.onlineAt = new Date();

                const hasSucceed = await this._updateUserOnlineStatusCommandHandler.handle(param);
                if (hasSucceed && userAuth.roleId !== RoleId.SUPER_ADMIN)
                    socket.nsp.emit(SocketNamespace.MESSAGE.EVENTS.USER_ONLINE_STATUS_CHANGED, param);
            });
        });
    }
}
