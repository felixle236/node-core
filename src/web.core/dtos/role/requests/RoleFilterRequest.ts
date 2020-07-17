import { BaseFilterRequest } from '../../common/BaseFilterRequest';
import { UserAuthenticated } from '../../common/UserAuthenticated';

export class RoleFilterRequest extends BaseFilterRequest {
    keyword?: string;

    userAuth?: UserAuthenticated;
}
