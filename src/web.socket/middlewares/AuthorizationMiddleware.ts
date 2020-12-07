import { Middleware, MiddlewareInterface } from 'socket-controllers';
import { ISocket } from '../../web.core/domain/common/socket/interfaces/ISocket';
import { Inject } from 'typedi';
import { JwtAuthUserQuery } from '../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../../web.core/usecases/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { RoleId } from '../../web.core/domain/enums/role/RoleId';
import { SocketNamespace } from '../../web.core/domain/common/socket/SocketNamespace';
import { UpdateUserOnlineStatusCommand } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommand';
import { UpdateUserOnlineStatusCommandHandler } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandHandler';

@Middleware()
export class CompressionMiddleware implements MiddlewareInterface {
    @Inject()
    private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler;

    @Inject()
    private readonly _updateUserOnlineStatusCommandHandler: UpdateUserOnlineStatusCommandHandler;

    async use(socket: ISocket, next: (err?: any)=> any) {
        const jwtParam = new JwtAuthUserQuery();
        jwtParam.token = socket.handshake.query.token;
        socket.userAuth = await this._jwtAuthUserQueryHandler.handle(jwtParam);

        socket.join(socket.userAuth.roleId);
        socket.join(socket.userAuth.userId);

        const param = new UpdateUserOnlineStatusCommand();
        param.id = socket.userAuth.userId;
        param.isOnline = true;

        const hasSucceed = await this._updateUserOnlineStatusCommandHandler.handle(param);
        if (hasSucceed && socket.userAuth.roleId !== RoleId.SUPER_ADMIN)
            socket.nsp.emit(SocketNamespace.MESSAGE.EVENTS.USER_ONLINE_STATUS_CHANGED, param);

        next();
    }
}
