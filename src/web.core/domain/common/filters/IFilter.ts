import { IQuery } from '../interactor/IQuery';

export interface IFilter extends IQuery {
    skip: number;
    limit: number;

    maxLimit(val: number): void;
    validate(): void;
}
