import { IMessageFilter } from '../../../../web.core/interfaces/filters/message/IMessageFilter';
import { IMessageRepository } from '../../../../web.core/interfaces/data/IMessageRepository';
import { Message } from '../../../../web.core/domain/entities/Message';
import { MessageCreateData } from '../../../../web.core/dtos/message/data/MessageCreateData';
import { MessageDbEntity } from '../entities/MessageDbEntity';
import { MessageSchema } from '../schemas/MessageSchema';
import { Service } from 'typedi';
import { SortType } from '../../../../web.core/domain/enums/SortType';
import { getRepository } from 'typeorm';

@Service('message.repository')
export class MessageRepository implements IMessageRepository {
    private readonly _repository = getRepository(MessageDbEntity);

    async find(filter: IMessageFilter): Promise<[Message[], number]> {
        let query = this._repository.createQueryBuilder(MessageSchema.TABLE_NAME)
            .andWhere(`${MessageSchema.TABLE_NAME}.${MessageSchema.COLUMNS.ROOM} = :room`, { room: filter.room });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(`${MessageSchema.TABLE_NAME}.${MessageSchema.COLUMNS.CONTENT} ilike :keyword`, { keyword });
        }
        query = query
            .orderBy(`${MessageSchema.TABLE_NAME}.${MessageSchema.COLUMNS.ID}`, SortType.DESC)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getById(id: number): Promise<Message | undefined> {
        const result = await this._repository.createQueryBuilder(MessageSchema.TABLE_NAME)
            .whereInIds(id)
            .getOne();
        return result?.toEntity();
    }

    async create(data: MessageCreateData): Promise<number | undefined> {
        const result = await this._repository.createQueryBuilder(MessageSchema.TABLE_NAME)
            .insert()
            .values(data)
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }
}
