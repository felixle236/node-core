import { IDbQueryRunner } from './IDbQueryRunner';
import { IFilter } from '../inputs/IFilter';

export interface IBaseRepository<TEntity, TIdentityType> {
    findAndCount(filter: IFilter): Promise<[TEntity[], number]>;

    count(filter: IFilter): Promise<number>;
    count(filter: IFilter, queryRunner: IDbQueryRunner): Promise<number>;

    getById(id: TIdentityType): Promise<TEntity | undefined>;
    getById(id: TIdentityType, queryRunner: IDbQueryRunner): Promise<TEntity | undefined>;

    create(data: TEntity): Promise<TIdentityType | undefined>;
    create(data: TEntity, queryRunner: IDbQueryRunner): Promise<TIdentityType | undefined>;

    createMultiple(list: TEntity[]): Promise<TIdentityType[]>;
    createMultiple(list: TEntity[], queryRunner: IDbQueryRunner): Promise<TIdentityType[]>;

    update(id: TIdentityType, data: TEntity): Promise<boolean>;
    update(id: TIdentityType, data: TEntity, queryRunner: IDbQueryRunner): Promise<boolean>;

    delete(id: TIdentityType | TIdentityType[]): Promise<boolean>;
    delete(id: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner): Promise<boolean>;

    softDelete(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
    softDelete(ids: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner): Promise<boolean>;

    restore(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
    restore(ids: TIdentityType | TIdentityType[], queryRunner: IDbQueryRunner): Promise<boolean>;
}
