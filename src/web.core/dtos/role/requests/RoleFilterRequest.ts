import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { IsBoolean } from 'class-validator';

export class RoleFilterRequest extends BaseFilterRequest {
    keyword?: string;

    @IsBoolean()
    isDeleted?: boolean;

    level?: number; // Role level
}
