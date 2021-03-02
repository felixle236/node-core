import { QueryPagination } from '../../../../domain/common/usecase/QueryPagination';
import { ManagerStatus } from '../../../../domain/enums/manager/ManagerStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';

export class FindManagerQuery extends QueryPagination {
    roleAuthId: RoleId;
    keyword: string | null;
    status: ManagerStatus | null;
}
