import { BaseFilter } from '../../../../web.core/domain/common/inputs/BaseFilter';
import { IRoleCommonFilter } from '../../../../web.core/interfaces/models/role/IRoleCommonFilter';
import { UserAuthenticated } from '../../../../web.core/domain/common/UserAuthenticated';

export class RoleCommonFilterRequest extends BaseFilter implements IRoleCommonFilter {
    keyword?: string;

    userAuth?: UserAuthenticated;
}
