import { IFilter } from '../inputs/IFilter';

export interface IRead<TEntity, TIdentityType> {
    find(filter: IFilter): Promise<[TEntity[], number]>;
    getById(id: TIdentityType): Promise<TEntity | undefined>;
}
