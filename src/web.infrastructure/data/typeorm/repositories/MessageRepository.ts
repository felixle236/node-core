import { mapModel, mapModels } from '../../../../libs/common';
import { IMessage } from '../../../../web.core/interfaces/models/IMessage';
import { IMessageRepository } from '../../../../web.core/interfaces/gateways/data/IMessageRepository';
import { Message } from '../../../../web.core/models/Message';
import { MessageEntity } from '../entities/MessageEntity';
import { MessageFilterRequest } from '../../../../web.core/dtos/message/requests/MessageFilterRequest';
import { MessageSchema } from '../schemas/MessageSchema';
import { Service } from 'typedi';
import { SortType } from '../../../../constants/Enums';
import { getRepository } from 'typeorm';

@Service('message.repository')
export class MessageRepository implements IMessageRepository {
    private readonly repository = getRepository<IMessage>(MessageEntity);

    async find(filter: MessageFilterRequest): Promise<[Message[], number]> {
        let query = this.repository.createQueryBuilder(MessageSchema.TABLE_NAME)
            .andWhere(`${MessageSchema.TABLE_NAME}.${MessageSchema.COLUMNS.ROOM} = :room`, { room: filter.room });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(`${MessageSchema.TABLE_NAME}.${MessageSchema.COLUMNS.CONTENT} ilike :keyword`, { keyword });
        }
        query = query
            .orderBy(`${MessageSchema.TABLE_NAME}.${MessageSchema.COLUMNS.ID}`, SortType.DESC)
            .skip(filter.skip)
            .take(filter.limit);

        const [messages, count] = await query.getManyAndCount();
        return [mapModels(Message, messages), count];
    }

    async getById(id: number): Promise<Message | undefined> {
        const message = await this.repository.createQueryBuilder(MessageSchema.TABLE_NAME)
            .whereInIds(id)
            .getOne();
        return mapModel(Message, message);
    }

    async create(message: Message): Promise<number | undefined> {
        const result = await this.repository.createQueryBuilder(MessageSchema.TABLE_NAME)
            .insert()
            .values(message.toData())
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }

    async update(id: number, message: Message): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(MessageSchema.TABLE_NAME)
            .update(message.toData())
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(MessageSchema.TABLE_NAME)
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }
}
