import { BaseFilter } from '../../../../domain/common/filters/BaseFilter';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';

export class FindRoleInput extends BaseFilter {
    keyword?: string;
    userAuth?: UserAuthenticated;
}
