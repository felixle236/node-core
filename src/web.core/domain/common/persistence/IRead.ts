import { IDbQueryRunner } from './IDbQueryRunner';
import { IFilter } from '../inputs/IFilter';

export interface IRead<TEntity, TIdentityType> {
    findAndCount(filter: IFilter): Promise<[TEntity[], number]>;

    count(filter: IFilter): Promise<number>;
    count(filter: IFilter, queryRunner: IDbQueryRunner): Promise<number>;

    getById(id: TIdentityType): Promise<TEntity | undefined>;
    getById(id: TIdentityType, queryRunner: IDbQueryRunner): Promise<TEntity | undefined>;
}
