import { IsBoolean } from 'class-validator';
import { QueryPagination } from '../../../../domain/common/usecase/QueryPagination';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';

export class FindUserQuery extends QueryPagination {
    roleAuthId: RoleId;
    keyword: string | null;
    roleIds: RoleId[] | null;
    status: UserStatus | null;

    @IsBoolean()
    isBirthdayNearly: boolean | null;
}
