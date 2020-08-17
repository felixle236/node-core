import { Inject, Service } from 'typedi';
import { CreateMessageInput } from './Input';
import { CreateMessageOutput } from './Output';
import { IContactStatusRepository } from '../../../gateways/repositories/IContactStatusRepository';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IMessageRepository } from '../../../gateways/repositories/IMessageRepository';
import { Message } from '../../../domain/entities/Message';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SocketIOEmitter } from 'socket.io-emitter';
import { SocketNamespace } from '../../../domain/common/socket/SocketNamespace';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';
import { sendByEmitter } from '../../../../libs/socket';

@Service()
export class CreateMessageInteractor implements IInteractor<CreateMessageInput, CreateMessageOutput> {
    @Inject('message.repository')
    private readonly _messageRepository: IMessageRepository;

    @Inject('contact.status.repository')
    private readonly _contactStatusRepository: IContactStatusRepository;

    @Inject('socket.io-emitter')
    private readonly _socketEmitter: SocketIOEmitter;

    async handle(param: CreateMessageInput, userAuth: UserAuthenticated): Promise<CreateMessageOutput> {
        const message = new Message();
        message.senderId = userAuth.userId;
        message.receiverId = param.receiverId;
        message.content = param.content;

        const id = await this._messageRepository.create(message);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._contactStatusRepository.addNewMessageStatus(message.senderId, message.receiverId);
        const newMessage = await this._messageRepository.getById(id);
        if (!newMessage)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const output = new CreateMessageOutput(newMessage);
        sendByEmitter(this._socketEmitter, SocketNamespace.MESSAGE.NAME, SocketNamespace.MESSAGE.EVENTS.MESSAGE_DIRECTLY, message.receiverId, output);
        return output;
    }
}
