import { IsBoolean } from 'class-validator';
import { QueryPagination } from '../../../../domain/common/usecase/QueryPagination';
import { ClientStatus } from '../../../../domain/enums/client/ClientStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';

export class FindClientQuery extends QueryPagination {
    roleAuthId: RoleId;
    keyword: string | null;
    status: ClientStatus | null;

    @IsBoolean()
    isBirthdayNearly: boolean | null;
}
