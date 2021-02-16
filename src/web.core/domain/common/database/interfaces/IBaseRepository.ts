import { IDbPagination } from './IDbPagination';
import { IDbQueryRunner } from './IDbQueryRunner';

export interface IBaseRepository<TEntity, TIdentityType> {
    findAndCount(filter: IDbPagination): Promise<[TEntity[], number]>;

    count(): Promise<number>;
    count(filter: IDbPagination): Promise<number>;
    count(filter: IDbPagination, queryRunner: IDbQueryRunner): Promise<number>;

    getById(id: TIdentityType): Promise<TEntity | null>;
    getById(id: TIdentityType, queryRunner: IDbQueryRunner): Promise<TEntity | null>;

    create(data: TEntity): Promise<TIdentityType | null>;
    create(data: TEntity, queryRunner: IDbQueryRunner): Promise<TIdentityType | null>;

    createGet(data: TEntity): Promise<TEntity | null>;
    createGet(data: TEntity, queryRunner: IDbQueryRunner): Promise<TEntity | null>;

    createMultiple(list: TEntity[]): Promise<TIdentityType[]>;
    createMultiple(list: TEntity[], queryRunner: IDbQueryRunner): Promise<TIdentityType[]>;

    update(id: TIdentityType, data: TEntity): Promise<boolean>;
    update(id: TIdentityType, data: TEntity, queryRunner: IDbQueryRunner): Promise<boolean>;

    updateGet(id: TIdentityType, data: TEntity): Promise<TEntity | null>;
    updateGet(id: TIdentityType, data: TEntity, queryRunner: IDbQueryRunner): Promise<TEntity | null>;

    delete(id: TIdentityType | TIdentityType[]): Promise<boolean>;
    delete(id: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner): Promise<boolean>;

    softDelete(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
    softDelete(ids: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner): Promise<boolean>;

    restore(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
    restore(ids: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner): Promise<boolean>;
}
