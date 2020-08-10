import { IFilterModel } from '../inputs/IFilterModel';

export interface IRead<TEntity, TIdentityType> {
    find(filters: IFilterModel): Promise<[TEntity[], number]>;
    getById(id: TIdentityType): Promise<TEntity | undefined>;
}
