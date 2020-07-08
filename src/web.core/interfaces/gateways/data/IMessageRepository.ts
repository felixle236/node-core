import { Message } from '../../../models/Message';
import { MessageCreateData } from '../../../dtos/message/data/MessageCreateData';
import { MessageFilterRequest } from '../../../dtos/message/requests/MessageFilterRequest';

export interface IMessageRepository {
    find(filter: MessageFilterRequest): Promise<[Message[], number]>;

    getById(id: number): Promise<Message | undefined>;

    create(message: MessageCreateData): Promise<number | undefined>;
}
