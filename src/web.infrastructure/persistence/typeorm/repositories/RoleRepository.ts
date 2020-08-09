import { Inject, Service } from 'typedi';
import { QueryRunner, getRepository } from 'typeorm';
import { DbContext } from '../DbContext';
import { IRoleCommonFilter } from '../../../../web.core/interfaces/filters/role/IRoleCommonFilter';
import { IRoleFilter } from '../../../../web.core/interfaces/filters/role/IRoleFilter';
import { IRoleRepository } from '../../../../web.core/interfaces/data/IRoleRepository';
import { Role } from '../../../../web.core/domain/entities/Role';
import { RoleEntity } from '../entities/RoleDbEntity';
import { RoleSchema } from '../schemas/RoleSchema';
import { SortType } from '../../../../web.core/domain/enums/SortType';

@Service('role.repository')
export class RoleRepository implements IRoleRepository {
    @Inject('database.context')
    private readonly _dbContext: DbContext;

    private readonly _repository = getRepository(RoleEntity);

    async getAll(expireTimeCaching: number = 24 * 60 * 60 * 1000): Promise<Role[]> {
        const list = await this._repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .orderBy(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL}`, SortType.ASC)
            .addOrderBy(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME}`, SortType.ASC)
            .cache('roles', expireTimeCaching)
            .getMany();
        return list.map(item => item.toEntity());
    }

    async find(filter: IRoleFilter): Promise<[Role[], number]> {
        let query = this._repository.createQueryBuilder(RoleSchema.TABLE_NAME);

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} > ${filter.userAuth.role.level}`);

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME} ilike :keyword`, { keyword });
        }

        query = query
            .orderBy(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL}`, SortType.ASC)
            .addOrderBy(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME}`, SortType.ASC)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findCommon(filter: IRoleCommonFilter): Promise<[Role[], number]> {
        let query = this._repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .select([
                `${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.ID}`,
                `${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME}`,
                `${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL}`
            ]);

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} > ${filter.userAuth.role.level}`);

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME} ilike :keyword`, { keyword });
        }

        query = query
            .orderBy(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL}`, SortType.ASC)
            .addOrderBy(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME}`, SortType.ASC)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getById(id: number): Promise<Role | undefined> {
        const result = await this._repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .whereInIds(id)
            .getOne();
        return result?.toEntity();
    }

    async checkNameExist(name: string, excludeId?: number): Promise<boolean> {
        let query = this._repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .where(`lower(${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME}) = lower(:name)`, { name });

        if (excludeId)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.ID} != :id`, { id: excludeId });

        const result = await query.getOne();
        return !!result;
    }

    async create(data: Role, queryRunner?: QueryRunner): Promise<number | undefined> {
        const result = await this._repository.createQueryBuilder(RoleSchema.TABLE_NAME, queryRunner)
            .insert()
            .values(new RoleEntity(data))
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }

    async update(id: number, data: Role): Promise<boolean> {
        const result = await this._repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .update(new RoleEntity(data))
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this._repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async clearCaching(): Promise<void> {
        await this._dbContext.clearCaching('roles');
    }
}