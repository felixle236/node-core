import { RoleId } from '@domain/enums/user/RoleId';
import { TraceRequest } from '@shared/request/TraceRequest';
import { ISocket } from '@shared/socket/interfaces/ISocket';
import { ChatNS } from '@shared/socket/namespaces/ChatNS';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { GetUserAuthByJwtHandler } from '@usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { UpdateUserOnlineStatusHandler } from '@usecases/user/user/update-user-online-status/UpdateUserOnlineStatusHandler';
import { UpdateUserOnlineStatusInput } from '@usecases/user/user/update-user-online-status/UpdateUserOnlineStatusInput';
import { sendAll } from '@utils/socket';
import { Server } from 'socket.io';
import { Service } from 'typedi';

@Service()
export default class ChatChannel {
    constructor(
        private readonly _getUserAuthByJwtHandler: GetUserAuthByJwtHandler,
        private readonly _updateUserOnlineStatusHandler: UpdateUserOnlineStatusHandler
    ) {}

    init(io: Server): void {
        const nsp = io.of('/' + ChatNS.NAME);

        // Ensure the socket is authorized
        nsp.use(async (socket: ISocket, next: (err?: Error) => void) => {
            try {
                const token = (socket.handshake.auth as {token: string}).token;
                const usecaseOption = new UsecaseOption();
                usecaseOption.trace = new TraceRequest();
                usecaseOption.trace.getFromSocket(socket);

                const { data } = await this._getUserAuthByJwtHandler.handle(token, usecaseOption);
                socket.userAuth = new UserAuthenticated(data.userId, data.roleId, data.type);
                next();
            }
            catch (error: any) {
                next(error);
            }
        });

        nsp.on('connection', async (socket: ISocket) => {
            const userAuth = socket.userAuth as UserAuthenticated;
            const param = new UpdateUserOnlineStatusInput();
            param.isOnline = true;
            param.onlineAt = new Date();

            const result = await this._updateUserOnlineStatusHandler.handle(userAuth.userId, param);
            if (result.data && userAuth.roleId !== RoleId.SuperAdmin) {
                sendAll(socket, ChatNS.EVENTS.ONLINE_STATUS_CHANGED, {
                    userId: userAuth.userId,
                    ...param
                });
            }

            socket.join(userAuth.roleId);
            socket.join(userAuth.userId);

            socket.on('disconnecting', async () => {
                const param = new UpdateUserOnlineStatusInput();
                param.isOnline = false;
                param.onlineAt = new Date();

                const result = await this._updateUserOnlineStatusHandler.handle(userAuth.userId, param);
                if (result.data && userAuth.roleId !== RoleId.SuperAdmin) {
                    sendAll(socket, ChatNS.EVENTS.ONLINE_STATUS_CHANGED, {
                        userId: userAuth.userId,
                        ...param
                    });
                }
            });

            socket.on('disconnect', () => {
                socket.leave(userAuth.roleId);
                socket.leave(userAuth.userId);
            });
        });
    }
}
