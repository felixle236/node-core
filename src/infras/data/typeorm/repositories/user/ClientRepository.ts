import { ClientDb } from '@data/typeorm/entities/user/ClientDb';
import { CLIENT_SCHEMA } from '@data/typeorm/schemas/user/ClientSchema';
import { Client } from '@domain/entities/user/Client';
import { FindClientFilter, IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { Service } from 'typedi';
import { Brackets, QueryRunner } from 'typeorm';
import { BaseRepository } from '../base/BaseRepository';

@Service('client.repository')
export class ClientRepository extends BaseRepository<string, Client, ClientDb> implements IClientRepository {
    constructor() {
        super(ClientDb, CLIENT_SCHEMA);
    }

    override async findAndCount(param: FindClientFilter): Promise<[Client[], number]> {
        let query = this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME);
        if (param.status)
            query = query.where(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.STATUS} = :status`, { status: param.status });

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getByEmail(email: string): Promise<Client | null> {
        const result = await this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME)
            .where(`LOWER(${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result ? result.toEntity() : null;
    }

    async checkEmailExist(email: string, queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(CLIENT_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .select(`${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${CLIENT_SCHEMA.TABLE_NAME}.${CLIENT_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }
}
