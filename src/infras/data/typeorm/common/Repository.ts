import { Entity } from 'domain/common/Entity';
import { DbQuerySession, SelectFilterListQuery, SelectFilterPaginationQuery, SelectFilterQuery, SelectRelationQuery, SelectSortQuery, UpdateFieldQuery } from 'shared/database/DbTypes';
import * as typeorm from 'typeorm';
import { DbEntity } from './DbEntity';
import { SCHEMA } from './Schema';

export abstract class Repository<TEntity extends Entity, TDbEntity extends DbEntity<TEntity>> {
    protected readonly repository: typeorm.Repository<TDbEntity>;

    constructor(private readonly _type: { new(): TDbEntity }, private readonly _schema: { TABLE_NAME: string } & typeof SCHEMA) {
        this.repository = typeorm.getRepository(_type);
    }

    protected handleSortQuery(query, sorts?: SelectSortQuery<TEntity>[]): void {
        if (sorts) {
            sorts.forEach(sort => {
                let field = '';
                if (sort.field === 'createdAt')
                    field = `${this._schema.TABLE_NAME}.${this._schema.COLUMNS.CREATED_AT}`;
                else if (sort.field === 'updatedAt')
                    field = `${this._schema.TABLE_NAME}.${this._schema.COLUMNS.UPDATED_AT}`;

                if (field)
                    query.addOrderBy(field, sort.type);
            });
        }
    }

    protected async clearCaching(key: string, querySession?: DbQuerySession): Promise<void> {
        const queryResultCache = this.repository.manager.connection.queryResultCache;
        if (queryResultCache)
            await queryResultCache.remove([key], querySession);
    }

    async findAll(filter: SelectFilterListQuery<TEntity>, querySession?: DbQuerySession): Promise<TEntity[]> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession);
        this.handleSortQuery(query, filter.sorts);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }

    async find(filter: SelectFilterPaginationQuery<TEntity>, querySession?: DbQuerySession): Promise<TEntity[]> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession);
        this.handleSortQuery(query, filter.sorts);

        query.skip(filter.skip);
        query.take(filter.limit);

        const list = await query.getMany();
        return list.map(item => item.toEntity());
    }

    async findOne(_filter: SelectFilterQuery<TEntity>, querySession?: DbQuerySession): Promise<TEntity | undefined> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession);

        const result = await query.getOne();
        return result && result.toEntity();
    }

    async findAndCount(filter: SelectFilterPaginationQuery<TEntity>, querySession?: DbQuerySession): Promise<[TEntity[], number]> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession);
        this.handleSortQuery(query, filter.sorts);

        query.skip(filter.skip);
        query.take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async count(_filter: SelectFilterQuery<TEntity>, querySession?: DbQuerySession): Promise<number> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession);
        return await query.getCount();
    }

    async get(id: string, _relations?: SelectRelationQuery<TEntity>[] | string[], querySession?: DbQuerySession): Promise<TEntity | undefined> {
        const query = this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .whereInIds(id);

        const result = await query.getOne();
        return result && result.toEntity();
    }

    async create(data: TEntity, querySession?: DbQuerySession): Promise<string> {
        const dataObject = new this._type();
        dataObject.fromEntity(data);

        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .insert()
            .values(dataObject.toJSON())
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(data: TEntity, _relations?: SelectRelationQuery<TEntity>[] | string[], querySession?: DbQuerySession): Promise<TEntity> {
        const dataObject = new this._type();
        dataObject.fromEntity(data);

        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .insert()
            .values(dataObject.toJSON())
            .execute();

        const result2 = await this.get(result.identifiers[0].id, _relations, querySession);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return result2!;
    }

    async createMultiple(list: TEntity[], querySession?: DbQuerySession): Promise<string[]> {
        const arr = list.map(item => {
            const dataObject = new this._type();
            dataObject.fromEntity(item);
            return dataObject.toJSON();
        });

        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .insert()
            .values(arr)
            .execute();
        return result.identifiers.map(identifier => identifier.id);
    }

    async update(id: string, data: TEntity, querySession?: DbQuerySession): Promise<boolean> {
        const dataObject = new this._type();
        dataObject.fromEntity(data);

        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .update(dataObject.toJSON())
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(id: string, data: TEntity, _relations?: SelectRelationQuery<TEntity>[] | string[], querySession?: DbQuerySession): Promise<TEntity | undefined> {
        const dataObject = new this._type();
        dataObject.fromEntity(data);

        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .update(dataObject.toJSON())
            .whereInIds(id)
            .execute();

        if (!result.affected)
            return;

        const result2 = await this.get(id, _relations, querySession);
        return result2;
    }

    async updateFields(id: string, data: TEntity, fields: UpdateFieldQuery<TEntity>[], querySession?: DbQuerySession): Promise<boolean> {
        const dataObject = new this._type();
        dataObject.fromEntity(data);
        const dataJson = dataObject.toJSON();

        const obj = {} as any;
        fields.forEach(field => {
            obj[field] = dataJson[field as any];
        });

        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string, querySession?: DbQuerySession): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[], querySession?: DbQuerySession): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string, querySession?: DbQuerySession): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[], querySession?: DbQuerySession): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string, querySession?: DbQuerySession): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[], querySession?: DbQuerySession): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME, querySession)
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
