export type DbQuerySession = any;

export type SelectFilterQuery<T> = { [k in Extract<keyof T, string>]?: any } & { relations?: string[] } & { [key: string]: any };

export type SelectFilterListQuery<T> = SelectFilterQuery<T> & { sorts?: string[] };

export type SelectFilterPaginationQuery<T> = SelectFilterListQuery<T> & { skip: number, limit: number };

export type UpdateFieldQuery<T> = Extract<keyof T, string>[] | string[];

export enum SortType {
    Asc = 'ASC',
    Desc = 'DESC'
}

export enum TransactionIsolationLevel {
    ReadUncommitted = 'READ UNCOMMITTED',
    ReadCommitted = 'READ COMMITTED',
    RepeatableRead = 'REPEATABLE READ',
    Serializable = 'SERIALIZABLE'
}
