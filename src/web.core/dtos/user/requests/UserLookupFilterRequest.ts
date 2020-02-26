import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { IsInt } from 'class-validator';

export class UserLookupFilterRequest extends BaseFilterRequest {
    keyword?: string;

    @IsInt()
    roleId?: number;

    level?: number; // Role level
}
