import { Inject, Service } from 'typedi';
import { CreateMessageInput } from './Input';
import { CreateMessageOutput } from './Output';
import { IContactStatusRepository } from '../../../gateways/repositories/IContactStatusRepository';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IMessageRepository } from '../../../gateways/repositories/IMessageRepository';
import { Message } from '../../../domain/entities/Message';
import { SocketIOEmitter } from 'socket.io-emitter';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';
import { sendByEmitter } from '../../../../libs/socket';
import { socketNamespace } from '../../../domain/common/SocketNamespace';

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
            throw new SystemError(5);

        await this._contactStatusRepository.addNewMessageStatus(message.senderId, message.receiverId);
        const newMessage = await this._messageRepository.getById(id);
        if (!newMessage)
            throw new SystemError(5);

        const output = new CreateMessageOutput(newMessage);
        sendByEmitter(this._socketEmitter, socketNamespace.message.name, socketNamespace.message.events.messageDirectly, message.receiverId.toString(), output);
        return output;
    }
}
