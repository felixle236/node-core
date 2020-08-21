import { ConnectedSocket, EmitOnFail, EmitOnSuccess, MessageBody, OnConnect, OnDisconnect, OnMessage, SkipEmitOnEmptyResult, SocketController, SocketQueryParam } from 'socket-controllers';
import { ConnectSocketInteractor } from '../../web.core/interactors/socket/connect/Interactor';
import { DisconnectSocketInteractor } from '../../web.core/interactors/socket/disconnect/Interactor';
import { FindMessageFilter } from '../../web.core/interactors/message/find-message/Filter';
import { FindMessageInteractor } from '../../web.core/interactors/message/find-message/Interactor';
import { FindMessageOutput } from '../../web.core/interactors/message/find-message/Output';
import { ISocket } from '../../web.core/domain/common/socket/ISocket';
import { PaginationResult } from '../../web.core/domain/common/outputs/PaginationResult';
import { Service } from 'typedi';
import { SocketInput } from '../../web.core/domain/common/socket/SocketInput';
import { SocketNamespace } from '../../web.core/domain/common/socket/SocketNamespace';

@Service()
@SocketController('/' + SocketNamespace.MESSAGE.NAME)
export default class MessageController {
    constructor(
        private readonly _connectSocketInteractor: ConnectSocketInteractor,
        private readonly _disconnectSocketInteractor: DisconnectSocketInteractor,
        private readonly _findMessageInteractor: FindMessageInteractor
    ) {}

    @OnConnect()
    async connect(@ConnectedSocket() socket: ISocket, @SocketQueryParam('token') token: string): Promise<void> {
        const param = new SocketInput(socket, token);
        await this._connectSocketInteractor.handle(param);
    }

    @OnDisconnect()
    async disconnect(@ConnectedSocket() socket: ISocket) {
        const param = new SocketInput(socket);
        await this._disconnectSocketInteractor.handle(param);
    }

    // Demo how to use socket controller.
    @OnMessage('message_list')
    @EmitOnFail('message_list_error')
    @EmitOnSuccess('message_list_successfully')
    @SkipEmitOnEmptyResult()
    async find(@ConnectedSocket() socket: ISocket, @MessageBody() filter: FindMessageFilter): Promise<PaginationResult<FindMessageOutput>> {
        return await this._findMessageInteractor.handle(filter, socket.userAuth);
    }
}
