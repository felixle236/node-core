import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { UserAuthenticated } from '../../user/UserAuthenticated';

export class MemberFilterRequest extends BaseFilterRequest {
    keyword?: string;

    userAuth?: UserAuthenticated;
}
