export interface IDbPaginationFilter {
    skip: number;
    limit: number;

    setPagination(skip: number, limit: number): void;
}
