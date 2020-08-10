import { Pagination } from './Pagination';

export class ResultList<T> {
    pagination: Pagination;
    results: T[]

    constructor(results: T[], total: number, skip: number, limit: number) {
        this.pagination = new Pagination(skip, limit, total);
        this.results = results;
    }
}
