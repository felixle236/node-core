import { IsBoolean } from 'class-validator';
import { Filter } from '../../../../domain/common/usecase/Filter';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';

export class FindUserQuery extends Filter {
    roleIds?: RoleId[];
    keyword?: string;
    status?: UserStatus;

    @IsBoolean()
    isBirthdayNearly?: boolean;

    roleAuthId: RoleId;
}
