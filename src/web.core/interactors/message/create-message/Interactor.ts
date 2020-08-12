import { Inject, Service } from 'typedi';
import { CreateMessageInput } from './Input';
import { CreateMessageOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IMemberStatusRepository } from '../../../interfaces/repositories/IMemberStatusRepository';
import { IMessageRepository } from '../../../interfaces/repositories/IMessageRepository';
import { Message } from '../../../domain/entities/Message';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class CreateMessageInteractor implements IInteractor<CreateMessageInput, CreateMessageOutput> {
    @Inject('message.repository')
    private readonly _messageRepository: IMessageRepository;

    @Inject('member.status.repository')
    private readonly _memberStatusRepository: IMemberStatusRepository;

    async handle(param: CreateMessageInput, userAuth: UserAuthenticated): Promise<CreateMessageOutput> {
        const message = new Message();
        message.senderId = userAuth.userId;
        message.receiverId = param.receiverId;
        message.content = param.content;

        const id = await this._messageRepository.create(message);
        if (!id)
            throw new SystemError(5);

        await this._memberStatusRepository.addNewMessageStatus(message.senderId, message.receiverId);
        const newMessage = await this._messageRepository.getById(id);
        if (newMessage)
            sendWithSender(socket, 'message_directly', newMessage.receiverId!.toString(), new MessageResponse(newMessage));
        return new CreateMessageOutput(id);
    }
}
