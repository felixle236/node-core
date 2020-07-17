import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { IsInt } from 'class-validator';
import { UserAuthenticated } from '../../common/UserAuthenticated';

export class UserCommonFilterRequest extends BaseFilterRequest {
    keyword?: string;

    @IsInt()
    roleId?: number;

    userAuth?: UserAuthenticated;
}
