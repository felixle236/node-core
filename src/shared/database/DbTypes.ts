export type DbConnection = any;

export type DbQuerySession = any;

export type DbFilterQuery<T> = { [k in Extract<keyof T, string>]?: any } & { [key: string]: any };

export type SelectRelationQuery<T> = Extract<keyof T, string>;

export type SelectSortQuery<T> = { field: Extract<keyof T, string>, type: SortType } & { field: string, type: SortType };

export type SelectFilterQuery<T> = { relations?: SelectRelationQuery<T>[] | string[] };

export type SelectFilterListQuery<T> = SelectFilterQuery<T> & { sorts?: SelectSortQuery<T>[] };

export type SelectFilterPaginationQuery<T> = SelectFilterListQuery<T> & { skip: number, limit: number };

export type UpdateFieldQuery<T> = Extract<keyof T, string>;

export enum SortType {
    Asc = 'ASC',
    Desc = 'DESC'
}
