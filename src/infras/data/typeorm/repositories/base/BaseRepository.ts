import { IEntity } from '@domain/interfaces/base/IEntity';
import { DbFilter } from '@shared/database/DbFilter';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { Inject } from 'typedi';
import { getRepository, QueryRunner, Repository } from 'typeorm';
import { BaseDbEntity } from '../../entities/base/BaseDBEntity';

export abstract class BaseRepository<TIdentityType, TEntity extends IEntity<TIdentityType>, TDbEntity extends BaseDbEntity<TIdentityType, TEntity>> implements IBaseRepository<TIdentityType, TEntity> {
    @Inject('db.context')
    protected readonly dbContext: IDbContext;

    protected readonly repository: Repository<TDbEntity>;

    constructor(private _type: { new(): TDbEntity }, private _schema: {TABLE_NAME: string}) {
        this.repository = getRepository(this._type);
    }

    async findAndCount(filter: DbPaginationFilter): Promise<[TEntity[], number]> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async count(_filter: DbFilter, queryRunner: IDbQueryRunner | null = null): Promise<number> {
        return await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner).getCount();
    }

    async getById(id: TIdentityType, queryRunner: IDbQueryRunner | null = null): Promise<TEntity | null> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .whereInIds(id)
            .getOne();
        return result ? result.toEntity() : null;
    }

    async create(data: TEntity, queryRunner: IDbQueryRunner | null = null): Promise<TIdentityType> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .insert()
            .values(new this._type().fromEntity(data) as any)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(data: TEntity, queryRunner: IDbQueryRunner | null = null): Promise<TEntity> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .insert()
            .values(new this._type().fromEntity(data) as any)
            .execute();

        const result2 = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .whereInIds(result.identifiers[0].id)
            .getOne();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return result2!.toEntity();
    }

    async createMultiple(list: TEntity[], queryRunner: IDbQueryRunner | null = null): Promise<TIdentityType[]> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .insert()
            .values(list.map(item => new this._type().fromEntity(item)) as any)
            .execute();
        return result.identifiers && result.identifiers.length ? result.identifiers.map(identifier => identifier.id) : [];
    }

    async update(id: TIdentityType, data: TEntity, queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .update(new this._type().fromEntity(data) as any)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(id: TIdentityType, data: TEntity, queryRunner: IDbQueryRunner | null = null): Promise<TEntity | null> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .update(new this._type().fromEntity(data) as any)
            .whereInIds(id)
            .execute();
        const hasSucceed = !!result.affected;
        if (!hasSucceed) return null;
        return await this.getById(id, queryRunner);
    }

    async delete(id: TIdentityType, queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: TIdentityType[], queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: TIdentityType, queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: TIdentityType[], queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: TIdentityType, queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: TIdentityType[], queryRunner: IDbQueryRunner | null = null): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
