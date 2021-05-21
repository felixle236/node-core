import { Server } from 'socket.io';
import { Service } from 'typedi';
import { ISocket } from '../../web.core/domain/common/socket/interfaces/ISocket';
import { ChatNS } from '../../web.core/domain/common/socket/namespaces/ChatNS';
import { RoleId } from '../../web.core/domain/enums/role/RoleId';
import { GetUserAuthByJwtQuery } from '../../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQuery';
import { GetUserAuthByJwtQueryHandler } from '../../web.core/usecases/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { UpdateUserOnlineStatusCommand } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommand';
import { UpdateUserOnlineStatusCommandHandler } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandHandler';

@Service()
export default class ChatController {
    constructor(
        private readonly _getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler,
        private readonly _updateUserOnlineStatusCommandHandler: UpdateUserOnlineStatusCommandHandler
    ) {}

    init(io: Server) {
        const nsp = io.of('/' + ChatNS.NAME);

        // Ensure the socket is authorized
        nsp.use(async (socket: ISocket, next: Function) => {
            try {
                const param = new GetUserAuthByJwtQuery();
                param.token = (socket.handshake.auth as {token: string}).token;
                const userAuth = await this._getUserAuthByJwtQueryHandler.handle(param);
                socket.userAuth = userAuth;
                next();
            }
            catch (error) {
                next(error);
            }
        });

        nsp.on('connection', async (socket: ISocket) => {
            const userAuth = socket.userAuth;
            if (!userAuth)
                socket.disconnect();
            else {
                const param = new UpdateUserOnlineStatusCommand();
                param.id = userAuth.userId;
                param.isOnline = true;
                param.onlineAt = new Date();

                const hasSucceed = await this._updateUserOnlineStatusCommandHandler.handle(param);
                if (hasSucceed && userAuth.roleId !== RoleId.SUPER_ADMIN)
                    socket.nsp.emit(ChatNS.EVENTS.ONLINE_STATUS_CHANGED, param);

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
                        socket.nsp.emit(ChatNS.EVENTS.ONLINE_STATUS_CHANGED, param);

                    socket.leave(userAuth.roleId);
                    socket.leave(userAuth.userId);
                });
            }
        });
    }
}
