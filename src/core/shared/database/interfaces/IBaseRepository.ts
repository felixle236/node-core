import { IDbFilter } from './IDbFilter';
import { IDbPaginationFilter } from './IDbPaginationFilter';
import { IDbQueryRunner } from './IDbQueryRunner';

export interface IBaseRepository<TIdentityType, TEntity> {
    findAndCount(param: IDbPaginationFilter): Promise<[TEntity[], number]>;

    count(param: IDbFilter, queryRunner?: IDbQueryRunner): Promise<number>;

    getById(id: TIdentityType, queryRunner?: IDbQueryRunner): Promise<TEntity | null>;

    create(data: TEntity, queryRunner?: IDbQueryRunner): Promise<TIdentityType | null>;

    createGet(data: TEntity, queryRunner?: IDbQueryRunner): Promise<TEntity | null>;

    createMultiple(list: TEntity[], queryRunner?: IDbQueryRunner): Promise<TIdentityType[]>;

    update(id: TIdentityType, data: TEntity, queryRunner?: IDbQueryRunner): Promise<boolean>;

    updateGet(id: TIdentityType, data: TEntity, queryRunner?: IDbQueryRunner): Promise<TEntity | null>;

    delete(id: TIdentityType | TIdentityType[], queryRunner?: IDbQueryRunner): Promise<boolean>;

    softDelete(ids: TIdentityType | TIdentityType[], queryRunner?: IDbQueryRunner): Promise<boolean>;

    restore(ids: TIdentityType | TIdentityType[], queryRunner?: IDbQueryRunner): Promise<boolean>;
}
