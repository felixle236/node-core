export interface IDbPagination {
    skip: number;
    limit: number;

    setPagination(skip: number, limit: number);
}
