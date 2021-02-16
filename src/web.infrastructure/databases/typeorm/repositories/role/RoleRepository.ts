import { Service } from 'typedi';
import { SortType } from '../../../../../web.core/domain/common/database/SortType';
import { Role } from '../../../../../web.core/domain/entities/role/Role';
import { FindRoleCommonFilter, FindRoleFilter, IRoleRepository } from '../../../../../web.core/gateways/repositories/role/IRoleRepository';
import { RoleDb } from '../../entities/role/RoleDb';
import { ROLE_SCHEMA } from '../../schemas/role/RoleSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('role.repository')
export class RoleRepository extends BaseRepository<Role, RoleDb, string> implements IRoleRepository {
    private readonly _roleListCacheKey = 'roles';

    constructor() {
        super(RoleDb, ROLE_SCHEMA);
    }

    async getAll(expireTimeCaching: number = 24 * 60 * 60 * 1000): Promise<Role[]> {
        const list = await this.repository.createQueryBuilder(ROLE_SCHEMA.TABLE_NAME)
            .orderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}`, SortType.ASC)
            .cache(this._roleListCacheKey, expireTimeCaching)
            .getMany();
        return list.map(item => item.toEntity());
    }

    async findAndCount(param: FindRoleFilter): Promise<[Role[], number]> {
        let query = this.repository.createQueryBuilder(ROLE_SCHEMA.TABLE_NAME);

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME} ILIKE :keyword`, { keyword });
        }

        query = query
            .orderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}`, SortType.ASC)
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findCommonAndCount(param: FindRoleCommonFilter): Promise<[Role[], number]> {
        let query = this.repository.createQueryBuilder(ROLE_SCHEMA.TABLE_NAME)
            .select([
                `${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.ID}`,
                `${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}`
            ]);

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME} ilike :keyword`, { keyword });
        }

        query = query
            .orderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}`, SortType.ASC)
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkNameExist(name: string, excludeId: string | null = null): Promise<boolean> {
        let query = this.repository.createQueryBuilder(ROLE_SCHEMA.TABLE_NAME)
            .where(`lower(${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}) = lower(:name)`, { name });

        if (excludeId)
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return !!result;
    }

    async clearCaching(): Promise<void> {
        await this.dbContext.getConnection().clearCaching(this._roleListCacheKey);
    }
}
