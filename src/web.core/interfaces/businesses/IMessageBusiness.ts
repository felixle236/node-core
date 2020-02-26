import { ISocket } from '../types/ISocket';
import { MemberFilterRequest } from '../../dtos/member/requests/MemberFilterRequest';
import { MemberResponse } from '../../dtos/member/responses/MemberResponse';
import { MessageCreateRequest } from '../../dtos/message/requests/MessageCreateRequest';
import { MessageFilterRequest } from '../../dtos/message/requests/MessageFilterRequest';
import { MessageResponse } from '../../dtos/message/responses/MessageResponse';
import { MessageRoomCreateRequest } from '../../dtos/message/requests/MessageRoomCreateRequest';
import { MessageRoomResponse } from '../../dtos/message/responses/MessageRoomResponse';
import { ResultListResponse } from '../../dtos/common/ResultListResponse';

export interface IMessageBusiness {
    connect(socket: ISocket, token: string): Promise<ISocket>;

    disconnect(socket: ISocket): void;

    find(socket: ISocket, filter: MessageFilterRequest): Promise<ResultListResponse<MessageResponse>>;

    findMembers(socket: ISocket, filter: MemberFilterRequest): Promise<ResultListResponse<MemberResponse>>;

    create(socket: ISocket, data: MessageCreateRequest): Promise<MessageResponse | undefined>;

    createByRoom(socket: ISocket, data: MessageRoomCreateRequest): Promise<MessageRoomResponse | undefined>;

    updateNewMessageStatus(socket: ISocket, id: number): Promise<boolean>;
}
