import { BaseRepository } from './base/BaseRepository';
import { FindMessageFilter } from '../../../../web.core/interactors/message/find-message/Filter';
import { IMessageRepository } from '../../../../web.core/gateways/repositories/IMessageRepository';
import { MESSAGE_SCHEMA } from '../schemas/MessageSchema';
import { Message } from '../../../../web.core/domain/entities/Message';
import { MessageDbEntity } from '../entities/MessageDbEntity';
import { Service } from 'typedi';
import { SortType } from '../../../../web.core/domain/common/persistence/SortType';

@Service('message.repository')
export class MessageRepository extends BaseRepository<Message, MessageDbEntity, string> implements IMessageRepository {
    constructor() {
        super(MessageDbEntity, MESSAGE_SCHEMA);
    }

    async findAndCount(filter: FindMessageFilter): Promise<[Message[], number]> {
        let query = this.repository.createQueryBuilder(MESSAGE_SCHEMA.TABLE_NAME)
            .andWhere(`${MESSAGE_SCHEMA.TABLE_NAME}.${MESSAGE_SCHEMA.COLUMNS.ROOM} = :room`, { room: filter.room });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(`${MESSAGE_SCHEMA.TABLE_NAME}.${MESSAGE_SCHEMA.COLUMNS.CONTENT} ilike :keyword`, { keyword });
        }
        query = query
            .orderBy(`${MESSAGE_SCHEMA.TABLE_NAME}.${MESSAGE_SCHEMA.COLUMNS.ID}`, SortType.DESC)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }
}
