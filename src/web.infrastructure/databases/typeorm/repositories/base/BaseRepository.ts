import { Inject } from 'typedi';
import { getRepository, QueryRunner, Repository } from 'typeorm';
import { DbPagination } from '../../../../../web.core/domain/common/database/DbPagination';
import { IBaseRepository } from '../../../../../web.core/domain/common/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '../../../../../web.core/domain/common/database/interfaces/IDbQueryRunner';
import { IEntity } from '../../../../../web.core/domain/types/base/IEntity';
import { DbContext } from '../../DbContext';
import { BaseDbEntity } from '../../entities/base/BaseDBEntity';

export abstract class BaseRepository<TEntity extends IEntity, TDbEntity extends BaseDbEntity<TEntity>, TIdentityType> implements IBaseRepository<TEntity, TIdentityType> {
    @Inject('db.context')
    protected readonly dbContext: DbContext;

    protected readonly repository: Repository<TDbEntity>;

    constructor(private _type: { new(): TDbEntity }, private _schema: {TABLE_NAME: string}) {
        this.repository = getRepository(this._type);
    }

    async findAndCount(filter: DbPagination): Promise<[TEntity[], number]> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async count(_filter: DbPagination | null = null, queryRunner: IDbQueryRunner | null = null): Promise<number> {
        return await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner).getCount();
    }

    async getById(id: TIdentityType, queryRunner: IDbQueryRunner | null = null): Promise<TEntity | null> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .whereInIds(id)
            .getOne();
        return result ? result.toEntity() : null;
    }

    async create(data: TEntity, queryRunner: IDbQueryRunner | null = null): Promise<TIdentityType | null> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .insert()
            .values(new this._type().fromEntity(data) as any)
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }

    async createGet(data: TEntity, queryRunner: IDbQueryRunner | null = null): Promise<TEntity | null> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner as QueryRunner)
            .insert()
            .values(new this._type().fromEntity(data) as any)
            .execute();
        const id = result.identifiers && result.identifiers.length && result.identifiers[0].id;
        if (!id) return null;
        return await this.getById(id, queryRunner);
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

    async delete(ids: TIdentityType | TIdentityType[]): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME)
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected;
    }

    async softDelete(ids: TIdentityType | TIdentityType[]): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME)
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected;
    }

    async restore(ids: TIdentityType | TIdentityType[]): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME)
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected;
    }
}
