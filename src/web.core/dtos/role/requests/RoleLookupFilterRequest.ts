import { BaseFilterRequest } from '../../common/BaseFilterRequest';

export class RoleLookupFilterRequest extends BaseFilterRequest {
    keyword?: string;

    level?: number; // Role level
}
