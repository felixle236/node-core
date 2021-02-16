import { QueryPagination } from '../../../../domain/common/usecase/QueryPagination';

export class FindRoleQuery extends QueryPagination {
    keyword: string | null;
}
