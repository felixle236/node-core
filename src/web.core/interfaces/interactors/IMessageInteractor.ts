import { IMemberFilter } from '../filters/member/IMemberFilter';
import { IMessageFilter } from '../filters/message/IMessageFilter';
import { ISocket } from '../../domain/common/ISocket';
import { MemberResponse } from '../../dtos/member/responses/MemberResponse';
import { MessageCreateRequest } from '../../dtos/message/requests/MessageCreateRequest';
import { MessageResponse } from '../../dtos/message/responses/MessageResponse';
import { MessageRoomCreateRequest } from '../../dtos/message/requests/MessageRoomCreateRequest';
import { MessageRoomResponse } from '../../dtos/message/responses/MessageRoomResponse';
import { ResultListResponse } from '../../dtos/common/ResultListResponse';

export interface IMessageInteractor {
    connect(socket: ISocket, token: string): Promise<ISocket>;

    disconnect(socket: ISocket): void;

    find(socket: ISocket, filter: IMessageFilter): Promise<ResultListResponse<MessageResponse>>;

    findMembers(socket: ISocket, filter: IMemberFilter): Promise<ResultListResponse<MemberResponse>>;

    create(socket: ISocket, data: MessageCreateRequest): Promise<MessageResponse | undefined>;

    createByRoom(socket: ISocket, data: MessageRoomCreateRequest): Promise<MessageRoomResponse | undefined>;

    updateNewMessageStatus(socket: ISocket, id: number): Promise<boolean>;
}
