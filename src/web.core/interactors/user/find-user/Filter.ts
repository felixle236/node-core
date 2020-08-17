import { IsEnum, IsUUID } from 'class-validator';
import { BaseFilter } from '../../../domain/common/inputs/BaseFilter';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';
import { UserStatus } from '../../../domain/enums/UserStatus';

export class FindUserFilter extends BaseFilter {
    keyword?: string;

    @IsUUID(4)
    roleId?: string;

    @IsEnum(UserStatus)
    status?: UserStatus;

    userAuth: UserAuthenticated;
}
