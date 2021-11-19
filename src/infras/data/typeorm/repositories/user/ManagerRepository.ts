import { Manager } from 'domain/entities/user/Manager';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Brackets } from 'typeorm';
import { Repository } from '../../common/Repository';
import { ManagerDb } from '../../entities/user/ManagerDb';
import { MANAGER_SCHEMA } from '../../schemas/user/ManagerSchema';

@Service(InjectRepository.Manager)
export class ManagerRepository extends Repository<Manager, ManagerDb> implements IManagerRepository {
    constructor() {
        super(ManagerDb, MANAGER_SCHEMA);
    }

    override async findAndCount(filter: { roleIds?: string[], keyword?: string, status?: ManagerStatus, skip: number, limit: number }): Promise<[Manager[], number]> {
        let query = this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME);
        if (filter.roleIds)
            query = query.andWhere(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.ROLE_ID} = ANY(:roleIds)`, { roleIds: filter.roleIds });

        if (filter.status)
            query = query.where(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.STATUS} = :status`, { status: filter.status });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }
        query.skip(filter.skip).take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getByEmail(email: string): Promise<Manager | undefined> {
        const result = await this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME)
            .where(`LOWER(${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result && result.toEntity();
    }

    async checkEmailExist(email: string): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(MANAGER_SCHEMA.TABLE_NAME)
            .select(`${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${MANAGER_SCHEMA.TABLE_NAME}.${MANAGER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }
}
