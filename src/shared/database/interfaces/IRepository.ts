import { DbQuerySession, SelectFilterQuery, UpdateFieldQuery } from '../DbTypes';

export interface IRepository<TEntity> {
    findAll(filter: SelectFilterQuery<TEntity>): Promise<TEntity[]>;
    findAll(filter: SelectFilterQuery<TEntity>, querySession: DbQuerySession): Promise<TEntity[]>;

    find(filter: SelectFilterQuery<TEntity>): Promise<TEntity[]>;
    find(filter: SelectFilterQuery<TEntity>, querySession: DbQuerySession): Promise<TEntity[]>;

    findOne(filter: SelectFilterQuery<TEntity>): Promise<TEntity | undefined>;
    findOne(filter: SelectFilterQuery<TEntity>, querySession: DbQuerySession): Promise<TEntity | undefined>;

    findAndCount(filter: SelectFilterQuery<TEntity>): Promise<[TEntity[], number]>;
    findAndCount(filter: SelectFilterQuery<TEntity>, querySession: DbQuerySession): Promise<[TEntity[], number]>;

    count(filter: SelectFilterQuery<TEntity>): Promise<number>;
    count(filter: SelectFilterQuery<TEntity>, querySession: DbQuerySession): Promise<number>;

    get(id: string): Promise<TEntity | undefined>;
    get(id: string, relations: string[]): Promise<TEntity | undefined>;
    get(id: string, relations: string[] | undefined, querySession: DbQuerySession): Promise<TEntity | undefined>;

    create(data: TEntity): Promise<string>;
    create(data: TEntity, querySession: DbQuerySession): Promise<string>;

    createGet(data: TEntity): Promise<TEntity>;
    createGet(data: TEntity, relations: string[]): Promise<TEntity>;
    createGet(data: TEntity, relations: string[] | undefined, querySession: DbQuerySession): Promise<TEntity>;

    createMultiple(list: TEntity[]): Promise<string[]>;
    createMultiple(list: TEntity[], querySession: DbQuerySession): Promise<string[]>;

    createOrUpdate(data: TEntity): Promise<string>;
    createOrUpdate(data: TEntity, querySession: DbQuerySession): Promise<string>;

    update(id: string, data: TEntity): Promise<boolean>;
    update(id: string, data: TEntity, querySession: DbQuerySession): Promise<boolean>;

    updateGet(id: string, data: TEntity): Promise<TEntity | undefined>;
    updateGet(id: string, data: TEntity, relations: string[]): Promise<TEntity | undefined>;
    updateGet(id: string, data: TEntity, relations: string[] | undefined, querySession: DbQuerySession): Promise<TEntity | undefined>;

    updateFields(id: string, data: TEntity, fields: UpdateFieldQuery<TEntity>): Promise<boolean>;
    updateFields(id: string, data: TEntity, fields: UpdateFieldQuery<TEntity>, querySession: DbQuerySession): Promise<boolean>;

    delete(id: string): Promise<boolean>;
    delete(id: string, querySession: DbQuerySession): Promise<boolean>;

    deleteMultiple(ids: string[]): Promise<boolean>;
    deleteMultiple(ids: string[], querySession: DbQuerySession): Promise<boolean>;

    softDelete(id: string): Promise<boolean>;
    softDelete(id: string, querySession: DbQuerySession): Promise<boolean>;

    softDeleteMultiple(ids: string[]): Promise<boolean>;
    softDeleteMultiple(ids: string[], querySession: DbQuerySession): Promise<boolean>;

    restore(id: string): Promise<boolean>;
    restore(id: string, querySession: DbQuerySession): Promise<boolean>;

    restoreMultiple(ids: string[]): Promise<boolean>;
    restoreMultiple(ids: string[], querySession: DbQuerySession): Promise<boolean>;
}
