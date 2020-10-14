import { IQuery } from './IQuery';

export interface IFilter extends IQuery {
    skip: number;
    limit: number;

    maxLimit(val: number): void;
}
