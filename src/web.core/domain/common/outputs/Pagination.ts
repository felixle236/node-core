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
