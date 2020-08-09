import { ResultList } from '../outputs/ResultList';

export interface IFilterModel {
    skip: number;
    limit: number;

    maxLimit(val: number): void;
    toResultList<T>(list: T[], total: number): ResultList<T>;
}
