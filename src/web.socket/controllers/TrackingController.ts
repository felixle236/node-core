import { ConnectedSocket, OnConnect, SocketController, SocketQueryParam } from 'socket-controllers';
import { ISocket } from '../../web.core/domain/common/socket/interfaces/ISocket';
import { JwtAuthUserQuery } from '../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { RoleId } from '../../web.core/domain/enums/role/RoleId';
import { Service } from 'typedi';
import { SocketNamespace } from '../../web.core/domain/common/socket/SocketNamespace';

@Service()
@SocketController('/' + SocketNamespace.TRACKING.NAME)
export default class ConfigurationController {
    constructor(
        private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler
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
            if (socket.userAuth.roleId === RoleId.SUPER_ADMIN)
                socket.join(socket.userAuth.roleId);
            socket.join(socket.userAuth.userId);
        }
    }
}
