import { IsEnum, IsInt } from 'class-validator';
import { BaseFilter } from '../../../domain/common/inputs/BaseFilter';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';
import { UserStatus } from '../../../domain/enums/UserStatus';

export class FindUserFilter extends BaseFilter {
    keyword?: string;

    @IsInt()
    roleId?: number;

    @IsEnum(UserStatus)
    status?: UserStatus;

    userAuth: UserAuthenticated;
}
