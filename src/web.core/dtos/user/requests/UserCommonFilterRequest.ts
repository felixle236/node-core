import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { IsInt } from 'class-validator';

export class UserCommonFilterRequest extends BaseFilterRequest {
    keyword?: string;

    @IsInt()
    roleId?: number;

    level?: number; // Role level
}
