import { BaseFilterRequest } from '../../common/BaseFilterRequest';

export class RoleCommonFilterRequest extends BaseFilterRequest {
    keyword?: string;

    level?: number; // Role level
}
