import { IDbFilter } from './IDbFilter';
import { IDbPaginationFilter } from './IDbPaginationFilter';
import { IDbQueryRunner } from './IDbQueryRunner';

export interface IBaseRepository<TIdentityType, TEntity> {
    findAndCount(param: IDbPaginationFilter): Promise<[TEntity[], number]>;

    count(param: IDbFilter): Promise<number>;
    count(param: IDbFilter, queryRunner: IDbQueryRunner | null): Promise<number>;

    get(id: TIdentityType): Promise<TEntity | null>;
    get(id: TIdentityType, queryRunner: IDbQueryRunner | null): Promise<TEntity | null>;

    create(data: TEntity): Promise<TIdentityType>;
    create(data: TEntity, queryRunner: IDbQueryRunner | null): Promise<TIdentityType>;

    createGet(data: TEntity): Promise<TEntity>;
    createGet(data: TEntity, queryRunner: IDbQueryRunner | null): Promise<TEntity>;

    createMultiple(list: TEntity[]): Promise<TIdentityType[]>;
    createMultiple(list: TEntity[], queryRunner: IDbQueryRunner | null): Promise<TIdentityType[]>;

    update(id: TIdentityType, data: TEntity): Promise<boolean>;
    update(id: TIdentityType, data: TEntity, queryRunner: IDbQueryRunner | null): Promise<boolean>;

    updateGet(id: TIdentityType, data: TEntity): Promise<TEntity | null>;
    updateGet(id: TIdentityType, data: TEntity, queryRunner: IDbQueryRunner | null): Promise<TEntity | null>;

    delete(id: TIdentityType | TIdentityType[]): Promise<boolean>;
    delete(id: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner | null): Promise<boolean>;

    softDelete(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
    softDelete(ids: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner | null): Promise<boolean>;

    restore(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
    restore(ids: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner | null): Promise<boolean>;
}
