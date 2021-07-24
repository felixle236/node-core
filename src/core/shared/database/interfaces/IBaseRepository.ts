import { IDbFilter } from './IDbFilter';
import { IDbPaginationFilter } from './IDbPaginationFilter';

export interface ISession { }

export interface IBaseRepository<TIdentityType, TEntity> {
    findAndCount(param: IDbPaginationFilter): Promise<[TEntity[], number]>;

    count(param: IDbFilter): Promise<number>;
    count(param: IDbFilter, session: ISession): Promise<number>;

    getById(id: TIdentityType): Promise<TEntity | null>;
    getById(id: TIdentityType, session: ISession): Promise<TEntity | null>;

    create(data: TEntity): Promise<TIdentityType | null>;
    create(data: TEntity, session: ISession): Promise<TIdentityType | null>;

    createGet(data: TEntity): Promise<TEntity | null>;
    createGet(data: TEntity, session: ISession): Promise<TEntity | null>;

    createMultiple(list: TEntity[]): Promise<TIdentityType[]>;
    createMultiple(list: TEntity[], session: ISession): Promise<TIdentityType[]>;

    update(id: TIdentityType, data: TEntity): Promise<boolean>;
    update(id: TIdentityType, data: TEntity, session: ISession): Promise<boolean>;

    updateGet(id: TIdentityType, data: TEntity): Promise<TEntity | null>;
    updateGet(id: TIdentityType, data: TEntity, session: ISession): Promise<TEntity | null>;

    delete(id: TIdentityType | TIdentityType[]): Promise<boolean>;
    delete(id: TIdentityType | TIdentityType[], session: ISession): Promise<boolean>;

    softDelete(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
    softDelete(ids: TIdentityType | TIdentityType[], session: ISession): Promise<boolean>;

    restore(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
    restore(ids: TIdentityType | TIdentityType[], session: ISession): Promise<boolean>;
}
