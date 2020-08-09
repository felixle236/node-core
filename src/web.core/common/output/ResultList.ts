import { IOutputBoundary } from '../../usecases/boundary/output/IOutputBoundary';
import { Pagination } from './Pagination';

export class ResultList<T> {
    pagination: Pagination;
    results: T[]

    constructor(results: T[], total: number, skip: number, limit: number) {
        this.pagination = new Pagination(skip, limit, total);
        this.results = results;
    }

    presentTo<T2 extends IOutputBoundary<T>>(_type: { new(): T2 }) {
        return new ResultList(this.results.map(entity => new _type().fromEntity(entity)), this.pagination.total, this.pagination.skip, this.pagination.limit);
    }
}
