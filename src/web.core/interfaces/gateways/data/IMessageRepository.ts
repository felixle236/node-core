import { Message } from '../../../models/Message';
import { MessageFilterRequest } from '../../../dtos/message/requests/MessageFilterRequest';

export interface IMessageRepository {
    find(filter: MessageFilterRequest): Promise<[Message[], number]>;

    getById(id: number): Promise<Message | undefined>;

    create(message: Message): Promise<number | undefined>;

    update(id: number, message: Message): Promise<boolean>;

    delete(id: number): Promise<boolean>;
}
