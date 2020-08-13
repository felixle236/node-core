import { BaseRepository } from './base/BaseRepository';
import { FindRoleCommonFilter } from '../../../../web.core/interactors/role/find-role-common/Filter';
import { FindRoleFilter } from '../../../../web.core/interactors/role/find-role/Filter';
import { IRoleRepository } from '../../../../web.core/interfaces/repositories/IRoleRepository';
import { ROLE_SCHEMA } from '../schemas/RoleSchema';
import { Role } from '../../../../web.core/domain/entities/Role';
import { RoleDbEntity } from '../entities/RoleDbEntity';
import { Service } from 'typedi';
import { SortType } from '../../../../web.core/domain/common/persistence/SortType';

@Service('role.repository')
export class RoleRepository extends BaseRepository<Role, RoleDbEntity, number> implements IRoleRepository {
    private readonly _roleListCacheKey = 'roles';

    constructor() {
        super(RoleDbEntity, ROLE_SCHEMA);
    }

    async getAll(expireTimeCaching: number = 24 * 60 * 60 * 1000): Promise<Role[]> {
        const list = await this.repository.createQueryBuilder(ROLE_SCHEMA.TABLE_NAME)
            .orderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.LEVEL}`, SortType.ASC)
            .addOrderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}`, SortType.ASC)
            .cache(this._roleListCacheKey, expireTimeCaching)
            .getMany();
        return list.map(item => item.toEntity());
    }

    async findAndCount(filter: FindRoleFilter): Promise<[Role[], number]> {
        let query = this.repository.createQueryBuilder(ROLE_SCHEMA.TABLE_NAME);

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.LEVEL} > :level`, { level: filter.userAuth.role.level });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME} ilike :keyword`, { keyword });
        }

        query = query
            .orderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.LEVEL}`, SortType.ASC)
            .addOrderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}`, SortType.ASC)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findCommonAndCount(filter: FindRoleCommonFilter): Promise<[Role[], number]> {
        let query = this.repository.createQueryBuilder(ROLE_SCHEMA.TABLE_NAME)
            .select([
                `${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.ID}`,
                `${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}`
            ]);

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.LEVEL} > :level`, { level: filter.userAuth.role.level });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME} ilike :keyword`, { keyword });
        }

        query = query
            .orderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.LEVEL}`, SortType.ASC)
            .addOrderBy(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.NAME}`, SortType.ASC)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async checkNameExist(name: string, excludeId?: number): Promise<boolean> {
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
