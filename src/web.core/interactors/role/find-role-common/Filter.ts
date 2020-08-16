import { BaseFilter } from '../../../domain/common/inputs/BaseFilter';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

export class FindRoleCommonFilter extends BaseFilter {
    keyword?: string;
    userAuth: UserAuthenticated;
}
