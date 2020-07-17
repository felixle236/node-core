import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { UserAuthenticated } from '../../common/UserAuthenticated';

export class MemberFilterRequest extends BaseFilterRequest {
    keyword?: string;

    userAuth?: UserAuthenticated;
}
