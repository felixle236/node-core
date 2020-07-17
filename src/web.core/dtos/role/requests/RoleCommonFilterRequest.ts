import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { UserAuthenticated } from '../../common/UserAuthenticated';

export class RoleCommonFilterRequest extends BaseFilterRequest {
    keyword?: string;

    userAuth?: UserAuthenticated;
}
