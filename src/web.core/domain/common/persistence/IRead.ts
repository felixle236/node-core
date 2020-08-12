import { IFilter } from '../inputs/IFilter';
import { QueryRunner } from 'typeorm';

export interface IRead<TEntity, TIdentityType> {
    findAndCount(filter: IFilter): Promise<[TEntity[], number]>;

    count(filter: IFilter): Promise<number>;
    count(filter: IFilter, queryRunner: QueryRunner): Promise<number>;

    getById(id: TIdentityType): Promise<TEntity | undefined>;
    getById(id: TIdentityType, queryRunner: QueryRunner): Promise<TEntity | undefined>;
}
