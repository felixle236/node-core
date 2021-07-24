import { IDbPaginationFilter } from './interfaces/IDbPaginationFilter';

export class DbPaginationFilter implements IDbPaginationFilter {
    skip: number;
    limit: number;

    setPagination(skip: number, limit: number): void {
        this.skip = skip;
        this.limit = limit;
    }
}
