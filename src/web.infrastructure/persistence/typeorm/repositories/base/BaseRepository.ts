import { QueryRunner, Repository, getRepository } from 'typeorm';
import { BaseDbEntity } from '../../entities/base/BaseDbEntity';
import { DbContext } from '../../DbContext';
import { IFilter } from '../../../../../web.core/domain/common/inputs/IFilter';
import { IRead } from '../../../../../web.core/domain/common/persistence/IRead';
import { IWrite } from '../../../../../web.core/domain/common/persistence/IWrite';

export abstract class BaseRepository<TEntity, TDbEntity extends BaseDbEntity<TEntity>, TIdentityType> implements IRead<TEntity, TIdentityType>, IWrite<TEntity, TIdentityType> {
    protected readonly dbContext: DbContext;
    protected readonly repository: Repository<TDbEntity>;

    constructor(private _type: { new(): TDbEntity }, private _schema: {TABLE_NAME: string}) {
        this.dbContext = new DbContext();
        this.repository = getRepository(this._type);
    }

    async findAndCount(filter: IFilter): Promise<[TEntity[], number]> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME)
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async count(_filter: IFilter, queryRunner?: QueryRunner): Promise<number> {
        return await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner).getCount();
    }

    async getById(id: TIdentityType, queryRunner?: QueryRunner): Promise<TEntity | undefined> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner)
            .whereInIds(id)
            .getOne();
        return result?.toEntity();
    }

    async create(data: TEntity, queryRunner?: QueryRunner): Promise<TIdentityType | undefined> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner)
            .insert()
            .values(new this._type().fromEntity(data) as any)
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }

    async createMultiple(list: TEntity[], queryRunner?: QueryRunner): Promise<TIdentityType[]> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner)
            .insert()
            .values(list.map(item => new this._type().fromEntity(item)) as any)
            .execute();
        return result.identifiers && result.identifiers.length ? result.identifiers.map(identifier => identifier.id) : [];
    }

    async update(id: TIdentityType, data: TEntity, queryRunner?: QueryRunner): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, queryRunner)
            .update(new this._type().fromEntity(data) as any)
            .whereInIds(id)
            .execute();
        return !!result.affected;
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
