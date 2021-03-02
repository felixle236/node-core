import { Service } from 'typedi';
import { Brackets, QueryRunner } from 'typeorm';
import { IDbQueryRunner } from '../../../../../web.core/domain/common/database/interfaces/IDbQueryRunner';
import { SortType } from '../../../../../web.core/domain/common/database/SortType';
import { Client } from '../../../../../web.core/domain/entities/client/Client';
import { ClientStatus } from '../../../../../web.core/domain/enums/client/ClientStatus';
import { FindClientFilter, IClientRepository } from '../../../../../web.core/gateways/repositories/client/IClientRepository';
import { ClientDb } from '../../entities/user/UserDb';
import { CLIENT_SCHEMA } from '../../schemas/client/ClientSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('client.repository')
export class ClientRepository extends BaseRepository<Client, ClientDb, string> implements IClientRepository {
    constructor() {
        super(ClientDb, CLIENT_SCHEMA);
    }

    async findAndCount(param: FindClientFilter): Promise<[Client[], number]> {
        let query = this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME)
            .where(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.STATUS} = :status`, { status: param.status || ClientStatus.ACTIVED });

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        query = query
            .orderBy(CLIENT_SCHEMA.TABLE_NAME + '.createdAt', SortType.DESC)
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getByEmail(email: string, queryRunner?: IDbQueryRunner): Promise<Client | undefined> {
        const result = await this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .andWhere(`LOWER(${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result?.toEntity();
    }

    async checkEmailExist(email: string, queryRunner?: IDbQueryRunner): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .select(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.ID}`)
            .andWhere(`LOWER(${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }
}
