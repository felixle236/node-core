import { QueryPagination } from '../../../../domain/common/usecase/QueryPagination';

export class FindRoleCommonQuery extends QueryPagination {
    keyword: string | null;
}
