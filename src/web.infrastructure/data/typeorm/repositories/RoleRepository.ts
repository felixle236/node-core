import { Inject, Service } from 'typedi';
import { QueryRunner, getRepository } from 'typeorm';
import { mapModel, mapModels } from '../../../../libs/common';
import { DbContext } from '../DbContext';
import { IRole } from '../../../../web.core/interfaces/models/IRole';
import { IRoleRepository } from '../../../../web.core/interfaces/gateways/data/IRoleRepository';
import { Role } from '../../../../web.core/models/Role';
import { RoleEntity } from '../entities/RoleEntity';
import { RoleFilterRequest } from '../../../../web.core/dtos/role/requests/RoleFilterRequest';
import { RoleLookupFilterRequest } from '../../../../web.core/dtos/role/requests/RoleLookupFilterRequest';
import { RoleSchema } from '../schemas/RoleSchema';
import { SortType } from '../../../../constants/Enums';

@Service('role.repository')
export class RoleRepository implements IRoleRepository {
    @Inject('database.context')
    private readonly dbContext: DbContext;

    private readonly repository = getRepository<IRole>(RoleEntity);

    async getAll(expireTimeCaching: number = 24 * 60 * 60 * 1000): Promise<Role[]> {
        const list = await this.repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .orderBy(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL}`, SortType.ASC)
            .addOrderBy(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME}`, SortType.ASC)
            .cache('roles', expireTimeCaching)
            .getMany();
        return mapModels(Role, list);
    }

    async find(filter: RoleFilterRequest): Promise<[Role[], number]> {
        let query = this.repository.createQueryBuilder(RoleSchema.TABLE_NAME);

        if (filter.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} > ${filter.level}`);

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
        return [mapModels(Role, list), count];
    }

    async lookup(filter: RoleLookupFilterRequest): Promise<[Role[], number]> {
        let query = this.repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .select([
                `${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.ID}`,
                `${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME}`,
                `${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL}`
            ]);

        if (filter.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} > ${filter.level}`);

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
        return [mapModels(Role, list), count];
    }

    async getById(id: number): Promise<Role | undefined> {
        const data = await this.repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .whereInIds(id)
            .getOne();
        return mapModel(Role, data);
    }

    async checkNameExist(name: string, excludeId?: number): Promise<boolean> {
        let query = this.repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .where(`lower(${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.NAME}) = lower(:name)`, { name });

        if (excludeId)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.ID} != :id`, { id: excludeId });

        const role = await query.getOne();
        return !!role;
    }

    async create(role: Role, queryRunner?: QueryRunner): Promise<number | undefined> {
        const result = await this.repository.createQueryBuilder(RoleSchema.TABLE_NAME, queryRunner)
            .insert()
            .values(role.toData())
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }

    async update(id: number, role: Role): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .update(role.toData())
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(RoleSchema.TABLE_NAME)
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async clearCaching(): Promise<void> {
        await this.dbContext.clearCaching('roles');
    }
}
