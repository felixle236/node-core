import { ConnectedSocket, OnConnect, OnDisconnect, SocketController, SocketQueryParam } from 'socket-controllers';
import { Service } from 'typedi';
import { ISocket } from '../../web.core/domain/common/socket/interfaces/ISocket';
import { SocketNamespace } from '../../web.core/domain/common/socket/SocketNamespace';
import { RoleId } from '../../web.core/domain/enums/role/RoleId';
import { JwtAuthUserQuery } from '../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { UpdateUserOnlineStatusCommand } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommand';
import { UpdateUserOnlineStatusCommandHandler } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandHandler';

@Service()
@SocketController('/' + SocketNamespace.MESSAGE.NAME)
export default class MessageController {
    constructor(
        private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler,
        private readonly _updateUserOnlineStatusCommandHandler: UpdateUserOnlineStatusCommandHandler
    ) {}

    @OnConnect()
    async connect(
        @ConnectedSocket() socket: ISocket,
        @SocketQueryParam('token') token: string
    ): Promise<void> {
        try {
            const param = new JwtAuthUserQuery();
            param.token = token;
            socket.userAuth = await this._jwtAuthUserQueryHandler.handle(param);
        }
        catch (error) {
            socket.emit('connect_error', error);
        }

        if (!socket.userAuth)
            socket.disconnect(true);
        else {
            const param = new UpdateUserOnlineStatusCommand();
            param.id = socket.userAuth.userId;
            param.isOnline = true;

            const hasSucceed = await this._updateUserOnlineStatusCommandHandler.handle(param);
            if (hasSucceed && socket.userAuth.roleId !== RoleId.SUPER_ADMIN)
                socket.nsp.emit(SocketNamespace.MESSAGE.EVENTS.USER_ONLINE_STATUS_CHANGED, param);

            socket.join(socket.userAuth.roleId);
            socket.join(socket.userAuth.userId);
        }
    }

    @OnDisconnect()
    async disconnect(@ConnectedSocket() socket: ISocket) {
        if (socket.userAuth) {
            const param = new UpdateUserOnlineStatusCommand();
            param.id = socket.userAuth.userId;
            param.isOnline = false;

            const hasSucceed = await this._updateUserOnlineStatusCommandHandler.handle(param);
            if (hasSucceed && socket.userAuth.roleId !== RoleId.SUPER_ADMIN)
                socket.nsp.emit(SocketNamespace.MESSAGE.EVENTS.USER_ONLINE_STATUS_CHANGED, param);
        }
    }
}
