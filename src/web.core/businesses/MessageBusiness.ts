import { Inject, Service } from 'typedi';
import { IAuthenticationBusiness } from '../interfaces/businesses/IAuthenticationBusiness';
import { IMemberStatusRepository } from '../interfaces/gateways/data/IMemberStatusRepository';
import { IMessageBusiness } from '../interfaces/businesses/IMessageBusiness';
import { IMessageRepository } from '../interfaces/gateways/data/IMessageRepository';
import { ISocket } from '../interfaces/types/ISocket';
import { IUserRepository } from '../interfaces/gateways/data/IUserRepository';
import { MemberFilterRequest } from '../dtos/member/requests/MemberFilterRequest';
import { MemberResponse } from '../dtos/member/responses/MemberResponse';
import { Message } from '../models/Message';
import { MessageCreateRequest } from '../dtos/message/requests/MessageCreateRequest';
import { MessageFilterRequest } from '../dtos/message/requests/MessageFilterRequest';
import { MessageResponse } from '../dtos/message/responses/MessageResponse';
import { MessageRoomCreateRequest } from '../dtos/message/requests/MessageRoomCreateRequest';
import { MessageRoomResponse } from '../dtos/message/responses/MessageRoomResponse';
import { ResultListResponse } from '../dtos/common/ResultListResponse';
import { RoleId } from '../../constants/Enums';
import { SystemError } from '../dtos/common/Exception';
import { mapModels } from '../../libs/common';
import { sendWithSender } from '../../libs/socket';

@Service('message.business')
export class MessageBusiness implements IMessageBusiness {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('member.status.repository')
    private readonly _memberStatusRepository: IMemberStatusRepository;

    @Inject('message.repository')
    private readonly _messageRepository: IMessageRepository;

    @Inject('authentication.business')
    private readonly _authBusiness: IAuthenticationBusiness;

    async connect(socket: ISocket, token: string): Promise<ISocket> {
        try {
            socket.userAuth = await this._authBusiness.authenticateUser(token);
        }
        catch (error) {
            socket.emit('connect_error', error);
        }

        if (!socket.userAuth)
            socket.disconnect(true);
        else {
            const user = await this._userRepository.getById(socket.userAuth.userId);
            if (!user)
                return socket.disconnect(true) as ISocket;

            await this._memberStatusRepository.addOnlineStatus(socket.userAuth.userId);
            socket.join(socket.userAuth.userId.toString());
            socket.join('0');

            if (user.role && user.role.id !== RoleId.SUPER_ADMIN)
                socket.nsp.emit('online_status', { id: socket.userAuth.userId, isOnline: true });
        }
        return socket;
    }

    async disconnect(socket: ISocket): Promise<void> {
        if (socket.userAuth) {
            await this._memberStatusRepository.removeOnlineStatus(socket.userAuth.userId);
            if (socket.userAuth.role.id !== RoleId.SUPER_ADMIN)
                socket.nsp.emit('online_status', { id: socket.userAuth.userId, isOnline: false });
        }
    }

    async find(socket: ISocket, filter: MessageFilterRequest): Promise<ResultListResponse<MessageResponse>> {
        if (filter.receiverId)
            filter.room = Message.generateRoom(socket.userAuth.userId, filter.receiverId);

        const [list, count] = await this._messageRepository.find(filter);
        await this._memberStatusRepository.removeNewMessageStatus(socket.userAuth.userId, filter.receiverId || 0);
        return filter.toResultList(mapModels(MessageResponse, list), count);
    }

    async findMembers(socket: ISocket, filter: MemberFilterRequest): Promise<ResultListResponse<MemberResponse>> {
        filter.userAuth = socket.userAuth;
        const [users, count] = await this._userRepository.findMembers(filter);
        const members = mapModels(MemberResponse, users);

        const onlineStatusList = await this._memberStatusRepository.getListOnlineStatus();
        onlineStatusList.forEach(onlineStatus => {
            const member = members.find(member => member.id === onlineStatus);
            if (member)
                member.isOnline = true;
        });

        const memberIds = await this._memberStatusRepository.getListNewMessageStatus(socket.userAuth.userId);
        memberIds.forEach(memberId => {
            const member = members.find(member => member.id === memberId);
            if (member)
                member.hasNewMessage = true;
        });

        return filter.toResultList(members, count);
    }

    async create(socket: ISocket, data: MessageCreateRequest): Promise<MessageResponse | undefined> {
        const message = new Message();
        message.senderId = socket.userAuth.userId;
        message.receiverId = data.receiverId;
        message.content = data.content;

        const createData = message.toCreateData();
        const id = await this._messageRepository.create(createData);
        if (!id)
            throw new SystemError(5);

        await this._memberStatusRepository.addNewMessageStatus(message.senderId, message.receiverId);
        const newMessage = await this._messageRepository.getById(id);
        if (newMessage)
            sendWithSender(socket, 'message_directly', newMessage.receiverId!.toString(), new MessageResponse(newMessage));
        return newMessage && new MessageResponse(newMessage);
    }

    async createByRoom(socket: ISocket, data: MessageRoomCreateRequest): Promise<MessageRoomResponse | undefined> {
        const message = new Message();
        message.senderId = socket.userAuth.userId;
        message.room = data.room;
        message.content = data.content;

        const createData = message.toCreateData();
        const id = await this._messageRepository.create(createData);
        if (!id)
            throw new SystemError(5);

        await this._memberStatusRepository.addNewMessageStatus(message.senderId, message.room);
        const newMessage = await this._messageRepository.getById(id);
        if (newMessage)
            sendWithSender(socket, 'message_room', message.room.toString(), new MessageResponse(newMessage));
        return newMessage && new MessageRoomResponse(newMessage);
    }

    async updateNewMessageStatus(socket: ISocket, room: number): Promise<boolean> {
        if (room === undefined || room < 0)
            throw new SystemError(1002, 'room');

        return await this._memberStatusRepository.removeNewMessageStatus(socket.userAuth.userId, room);
    }
}
