import { ConnectedSocket, EmitOnFail, EmitOnSuccess, MessageBody, OnConnect, OnDisconnect, OnMessage, SkipEmitOnEmptyResult, SocketController, SocketQueryParam } from 'socket-controllers';
import { Inject, Service } from 'typedi';
import { IMessageBusiness } from '../../web.core/interfaces/businesses/IMessageBusiness';
import { ISocket } from '../../web.core/interfaces/types/ISocket';
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
    @Inject('message.business')
    private readonly messageBusiness: IMessageBusiness;

    @OnConnect()
    async connect(@ConnectedSocket() socket: ISocket, @SocketQueryParam('token') token: string): Promise<void> {
        await this.messageBusiness.connect(socket, token);
    }

    @OnDisconnect()
    disconnect(@ConnectedSocket() socket: ISocket) {
        this.messageBusiness.disconnect(socket);
    }

    @OnMessage('message_list')
    @EmitOnFail('message_list_error')
    @EmitOnSuccess('message_list_successfully')
    @SkipEmitOnEmptyResult()
    async find(@ConnectedSocket() socket: ISocket, @MessageBody() filter: MessageFilterRequest): Promise<ResultListResponse<MessageResponse>> {
        return await this.messageBusiness.find(socket, filter);
    }

    @OnMessage('member_list')
    @EmitOnFail('member_list_error')
    @EmitOnSuccess('member_list_successfully')
    @SkipEmitOnEmptyResult()
    async findMembers(@ConnectedSocket() socket: ISocket, @MessageBody() filter: MemberFilterRequest): Promise<ResultListResponse<MemberResponse>> {
        return await this.messageBusiness.findMembers(socket, filter);
    }

    @OnMessage('message_directly')
    @EmitOnFail('message_directly_error')
    @EmitOnSuccess('message_directly_successfully')
    @SkipEmitOnEmptyResult()
    async create(@ConnectedSocket() socket: ISocket, @MessageBody() data: MessageCreateRequest): Promise<MessageResponse | undefined> {
        return await this.messageBusiness.create(socket, data);
    }

    @OnMessage('message_room')
    @EmitOnFail('message_room_error')
    @EmitOnSuccess('message_room_successfully')
    @SkipEmitOnEmptyResult()
    async createByRoom(@ConnectedSocket() socket: ISocket, @MessageBody() data: MessageRoomCreateRequest): Promise<MessageRoomResponse | undefined> {
        return await this.messageBusiness.createByRoom(socket, data);
    }

    @OnMessage('message_status')
    @EmitOnFail('message_status_error')
    @EmitOnSuccess('message_status_successfully')
    @SkipEmitOnEmptyResult()
    async updateStatus(@ConnectedSocket() socket: ISocket, @MessageBody() room: number): Promise<boolean> {
        return await this.messageBusiness.updateNewMessageStatus(socket, room);
    }
}
