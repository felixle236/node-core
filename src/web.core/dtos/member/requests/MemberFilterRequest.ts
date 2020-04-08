import { BaseFilterRequest } from '../../common/BaseFilterRequest';

export class MemberFilterRequest extends BaseFilterRequest {
    keyword?: string;

    level?: number; // Role level
}
