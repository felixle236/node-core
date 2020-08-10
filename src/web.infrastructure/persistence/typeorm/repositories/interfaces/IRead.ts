import { IFilterModel } from '../../../../../web.core/domain/common/inputs/IFilterModel';

export interface IRead<T> {
    find(filters: IFilterModel): Promise<[T[], number]>;
    getById(id: number | string): Promise<T | undefined>;
}
