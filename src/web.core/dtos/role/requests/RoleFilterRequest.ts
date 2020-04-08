import { BaseFilterRequest } from '../../common/BaseFilterRequest';

export class RoleFilterRequest extends BaseFilterRequest {
    keyword?: string;

    level?: number; // Role level
}
