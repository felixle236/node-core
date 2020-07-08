import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { UserAuthenticated } from '../../user/UserAuthenticated';

export class RoleCommonFilterRequest extends BaseFilterRequest {
    keyword?: string;

    userAuth?: UserAuthenticated;
}
