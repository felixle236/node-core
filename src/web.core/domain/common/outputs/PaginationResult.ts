export class PaginationResult<T> {
    pagination: Pagination;
    data: T[]

    constructor(data: T[], total: number, skip: number, limit: number) {
        this.pagination = new Pagination(skip, limit, total);
        this.data = data;
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
