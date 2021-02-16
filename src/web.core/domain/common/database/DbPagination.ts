import { IDbPagination } from './interfaces/IDbPagination';

export class DbPagination implements IDbPagination {
    skip: number;
    limit: number;

    setPagination(skip: number, limit: number) {
        this.skip = skip;
        this.limit = limit;
    }
}
