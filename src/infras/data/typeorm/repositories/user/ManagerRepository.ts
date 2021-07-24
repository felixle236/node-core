import { ManagerDb } from '@data/typeorm/entities/user/ManagerDb';
import { MANAGER_SCHEMA } from '@data/typeorm/schemas/user/ManagerSchema';
import { Manager } from '@domain/entities/user/Manager';
import { FindManagerFilter, IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { Service } from 'typedi';
import { Brackets, QueryRunner } from 'typeorm';
import { BaseRepository } from '../base/BaseRepository';

@Service('manager.repository')
export class ManagerRepository extends BaseRepository<string, Manager, ManagerDb> implements IManagerRepository {
    constructor() {
        super(ManagerDb, MANAGER_SCHEMA);
    }

    override async findAndCount(param: FindManagerFilter): Promise<[Manager[], number]> {
        let query = this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME);
        if (param.status)
            query = query.where(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.STATUS} = :status`, { status: param.status });

        if (param.roleIds)
            query = query.andWhere(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.ROLE_ID} = ANY(:roleIds)`, { roleIds: param.roleIds });

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getByEmail(email: string): Promise<Manager | null> {
        const result = await this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME)
            .where(`LOWER(${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result ? result.toEntity() : null;
    }

    async checkEmailExist(email: string, queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .select(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }
}
