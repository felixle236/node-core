import { ConnectedSocket, EmitOnFail, EmitOnSuccess, MessageBody, OnConnect, OnDisconnect, OnMessage, SkipEmitOnEmptyResult, SocketController, SocketQueryParam } from 'socket-controllers';
import { ISocket } from '../../../web.core/domain/common/socket/interfaces/ISocket';
import { JwtAuthUserQuery } from '../../../web.core/interactors/auth/queries/jwt-auth-user/JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from '../../../web.core/interactors/auth/queries/jwt-auth-user/JwtAuthUserQueryHandler';
import { RoleId } from '../../../web.core/domain/enums/role/RoleId';
import { Service } from 'typedi';
import { SocketNamespace } from '../../../web.core/domain/common/socket/SocketNamespace';
import { UpdateUserOnlineStatusCommand } from '../../../web.core/interactors/user/commands/update-user-online-status/UpdateUserOnlineStatusCommand';
import { UpdateUserOnlineStatusCommandHandler } from '../../../web.core/interactors/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandHandler';

@Service()
@SocketController('/' + SocketNamespace.CONFIGURATION.NAME)
export default class ConfigurationController {
    constructor(
        private readonly _jwtAuthUserQueryHandler: JwtAuthUserQueryHandler,
        private readonly _updateUserOnlineStatusCommandHandler: UpdateUserOnlineStatusCommandHandler
    ) {}

    @OnConnect()
    async connect(@ConnectedSocket() socket: ISocket, @SocketQueryParam('token') token: string): Promise<void> {
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
                socket.nsp.emit(SocketNamespace.CONFIGURATION.EVENTS.USER_ONLINE_STATUS_CHANGED, param);
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
                socket.nsp.emit(SocketNamespace.CONFIGURATION.EVENTS.USER_ONLINE_STATUS_CHANGED, param);
        }
    }

    // Demo how to use socket controller.
    @OnMessage('message_list')
    @EmitOnFail('message_list_error')
    @EmitOnSuccess('message_list_successfully')
    @SkipEmitOnEmptyResult()
    async find(@ConnectedSocket() _socket: ISocket, @MessageBody() _param: any): Promise<string> {
        return '';
    }
}
