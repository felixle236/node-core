import { Inject, Service } from 'typedi';
import { CreateMessageGroupInput } from './Input';
import { CreateMessageGroupOutput } from './Output';
import { IContactStatusRepository } from '../../../interfaces/repositories/IContactStatusRepository';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IMessageRepository } from '../../../interfaces/repositories/IMessageRepository';
import { Message } from '../../../domain/entities/Message';
import { SocketIOEmitter } from 'socket.io-emitter';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';
import { sendByEmitter } from '../../../../libs/socket';
import { socketNamespace } from '../../../domain/common/SocketNamespace';

@Service()
export class CreateMessageGroupInteractor implements IInteractor<CreateMessageGroupInput, CreateMessageGroupOutput> {
    @Inject('message.repository')
    private readonly _messageRepository: IMessageRepository;

    @Inject('contact.status.repository')
    private readonly _contactStatusRepository: IContactStatusRepository;

    @Inject('socket.io-emitter')
    private readonly _socketEmitter: SocketIOEmitter;

    async handle(param: CreateMessageGroupInput, userAuth: UserAuthenticated): Promise<CreateMessageGroupOutput> {
        const message = new Message();
        message.senderId = userAuth.userId;
        message.room = param.room;
        message.content = param.content;

        const id = await this._messageRepository.create(message);
        if (!id)
            throw new SystemError(5);

        await this._contactStatusRepository.addNewMessageStatus(message.senderId, message.room);
        const newMessage = await this._messageRepository.getById(id);
        if (!newMessage)
            throw new SystemError(5);

        const output = new CreateMessageGroupOutput(newMessage);
        sendByEmitter(this._socketEmitter, socketNamespace.message.name, socketNamespace.message.events.messageGroup, message.room.toString(), output);
        return output;
    }
}
