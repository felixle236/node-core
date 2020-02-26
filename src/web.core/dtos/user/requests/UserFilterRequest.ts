import { IsBoolean, IsInt } from 'class-validator';
import { BaseFilterRequest } from '../../common/BaseFilterRequest';

export class UserFilterRequest extends BaseFilterRequest {
    keyword?: string;

    @IsInt()
    roleId?: number;

    @IsBoolean()
    isDeleted?: boolean;

    @IsBoolean()
    isActived?: boolean;

    level?: number; // Role level
}
