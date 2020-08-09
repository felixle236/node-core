import { ConnectedSocket, EmitOnFail, EmitOnSuccess, MessageBody, OnConnect, OnDisconnect, OnMessage, SkipEmitOnEmptyResult, SocketController, SocketQueryParam } from 'socket-controllers';
import { Inject, Service } from 'typedi';
import { IMessageInteractor } from '../../web.core/interfaces/interactors/IMessageInteractor';
import { ISocket } from '../../web.core/domain/common/ISocket';
import { MemberFilterRequest } from '../../web.core/dtos/member/requests/MemberFilterRequest';
import { MemberResponse } from '../../web.core/dtos/member/responses/MemberResponse';
import { MessageCreateRequest } from '../../web.core/dtos/message/requests/MessageCreateRequest';
import { MessageFilterRequest } from '../../web.core/dtos/message/requests/MessageFilterRequest';
import { MessageResponse } from '../../web.core/dtos/message/responses/MessageResponse';
import { MessageRoomCreateRequest } from '../../web.core/dtos/message/requests/MessageRoomCreateRequest';
import { MessageRoomResponse } from '../../web.core/dtos/message/responses/MessageRoomResponse';
import { ResultListResponse } from '../../web.core/dtos/common/ResultListResponse';

@Service()
@SocketController('/messages')
export default class MessageController {
    @Inject('message.interactor')
    private readonly _messageInteractor: IMessageInteractor;

    @OnConnect()
    async connect(@ConnectedSocket() socket: ISocket, @SocketQueryParam('token') token: string): Promise<void> {
        await this._messageInteractor.connect(socket, token);
    }

    @OnDisconnect()
    disconnect(@ConnectedSocket() socket: ISocket) {
        this._messageInteractor.disconnect(socket);
    }

    @OnMessage('message_list')
    @EmitOnFail('message_list_error')
    @EmitOnSuccess('message_list_successfully')
    @SkipEmitOnEmptyResult()
    async find(@ConnectedSocket() socket: ISocket, @MessageBody() filter: MessageFilterRequest): Promise<ResultListResponse<MessageResponse>> {
        return await this._messageInteractor.find(socket, filter);
    }

    @OnMessage('member_list')
    @EmitOnFail('member_list_error')
    @EmitOnSuccess('member_list_successfully')
    @SkipEmitOnEmptyResult()
    async findMembers(@ConnectedSocket() socket: ISocket, @MessageBody() filter: MemberFilterRequest): Promise<ResultListResponse<MemberResponse>> {
        return await this._messageInteractor.findMembers(socket, filter);
    }

    @OnMessage('message_directly')
    @EmitOnFail('message_directly_error')
    @EmitOnSuccess('message_directly_successfully')
    @SkipEmitOnEmptyResult()
    async create(@ConnectedSocket() socket: ISocket, @MessageBody() data: MessageCreateRequest): Promise<MessageResponse | undefined> {
        return await this._messageInteractor.create(socket, data);
    }

    @OnMessage('message_room')
    @EmitOnFail('message_room_error')
    @EmitOnSuccess('message_room_successfully')
    @SkipEmitOnEmptyResult()
    async createByRoom(@ConnectedSocket() socket: ISocket, @MessageBody() data: MessageRoomCreateRequest): Promise<MessageRoomResponse | undefined> {
        return await this._messageInteractor.createByRoom(socket, data);
    }

    @OnMessage('message_status')
    @EmitOnFail('message_status_error')
    @EmitOnSuccess('message_status_successfully')
    @SkipEmitOnEmptyResult()
    async updateStatus(@ConnectedSocket() socket: ISocket, @MessageBody() room: number): Promise<boolean> {
        return await this._messageInteractor.updateNewMessageStatus(socket, room);
    }
}
