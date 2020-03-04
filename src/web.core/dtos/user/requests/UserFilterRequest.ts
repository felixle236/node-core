import { IsBoolean, IsInt } from 'class-validator';
import { BaseFilterRequest } from '../../common/BaseFilterRequest';

export class UserFilterRequest extends BaseFilterRequest {
    keyword?: string;

    @IsInt()
    roleId?: number;

    @IsBoolean()
    isActived?: boolean;

    level?: number; // Role level
}
