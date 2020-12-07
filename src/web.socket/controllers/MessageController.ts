import { ConnectedSocket, OnDisconnect, SocketController } from 'socket-controllers';
import { ISocket } from '../../web.core/domain/common/socket/interfaces/ISocket';
import { RoleId } from '../../web.core/domain/enums/role/RoleId';
import { Service } from 'typedi';
import { SocketNamespace } from '../../web.core/domain/common/socket/SocketNamespace';
import { UpdateUserOnlineStatusCommand } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommand';
import { UpdateUserOnlineStatusCommandHandler } from '../../web.core/usecases/user/commands/update-user-online-status/UpdateUserOnlineStatusCommandHandler';

@Service()
@SocketController('/' + SocketNamespace.MESSAGE.NAME)
export default class MessageController {
    constructor(
        private readonly _updateUserOnlineStatusCommandHandler: UpdateUserOnlineStatusCommandHandler
    ) {}

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
