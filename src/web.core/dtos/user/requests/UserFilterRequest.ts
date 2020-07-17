import { IsEnum, IsInt } from 'class-validator';
import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { UserAuthenticated } from '../../common/UserAuthenticated';
import { UserStatus } from '../../../../constants/Enums';

export class UserFilterRequest extends BaseFilterRequest {
    keyword?: string;

    @IsInt()
    roleId?: number;

    @IsEnum(UserStatus)
    status?: UserStatus;

    userAuth?: UserAuthenticated;
}
