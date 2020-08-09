import { IMessageFilter } from '../filters/message/IMessageFilter';
import { Message } from '../../domain/entities/Message';
import { MessageCreateData } from '../../dtos/message/data/MessageCreateData';

export interface IMessageRepository {
    find(filter: IMessageFilter): Promise<[Message[], number]>;

    getById(id: number): Promise<Message | undefined>;

    create(message: MessageCreateData): Promise<number | undefined>;
}
