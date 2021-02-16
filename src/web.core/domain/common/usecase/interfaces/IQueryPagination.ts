export interface IQueryPagination {
    skip: number;
    limit: number;

    maxLimit(val: number): void;
}
