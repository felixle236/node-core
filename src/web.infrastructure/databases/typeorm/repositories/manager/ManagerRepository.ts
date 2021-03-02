import { Service } from 'typedi';
import { Brackets, QueryRunner } from 'typeorm';
import { IDbQueryRunner } from '../../../../../web.core/domain/common/database/interfaces/IDbQueryRunner';
import { SortType } from '../../../../../web.core/domain/common/database/SortType';
import { Manager } from '../../../../../web.core/domain/entities/manager/Manager';
import { ManagerStatus } from '../../../../../web.core/domain/enums/manager/ManagerStatus';
import { FindManagerFilter, IManagerRepository } from '../../../../../web.core/gateways/repositories/manager/IManagerRepository';
import { ManagerDb } from '../../entities/user/UserDb';
import { MANAGER_SCHEMA } from '../../schemas/manager/ManagerSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('manager.repository')
export class ManagerRepository extends BaseRepository<Manager, ManagerDb, string> implements IManagerRepository {
    constructor() {
        super(ManagerDb, MANAGER_SCHEMA);
    }

    async findAndCount(param: FindManagerFilter): Promise<[Manager[], number]> {
        let query = this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME)
            .where(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.STATUS} = :status`, { status: param.status || ManagerStatus.ACTIVED });

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        query = query
            .orderBy(MANAGER_SCHEMA.TABLE_NAME + '.createdAt', SortType.DESC)
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getByEmail(email: string, queryRunner?: IDbQueryRunner): Promise<Manager | undefined> {
        const result = await this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .andWhere(`LOWER(${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result?.toEntity();
    }

    async checkEmailExist(email: string, queryRunner?: IDbQueryRunner): Promise<boolean> {
        const query = this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .select(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email });

        const result = await query.getOne();
        return !!result;
    }
}
