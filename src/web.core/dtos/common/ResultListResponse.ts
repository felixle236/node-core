export class ResultListResponse<T> {
    pagination: Pagination;
    results: T[]

    constructor(results: T[], total: number, skip: number, limit: number) {
        this.pagination = new Pagination(skip, limit, total);
        this.results = results;
    }
}

export class Pagination {
    skip: number;
    limit: number;
    total: number;

    constructor(skip: number, limit: number, total: number) {
        this.skip = skip;
        this.limit = limit;
        this.total = total;
    }
}
