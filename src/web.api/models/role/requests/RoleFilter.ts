import { BaseFilter } from '../../../../web.core/domain/common/inputs/BaseFilter';
import { IRoleFilter } from '../../../../web.core/usecase/boundaries/models/role/IRoleFilter';
import { UserAuthenticated } from '../../../../web.core/domain/common/UserAuthenticated';

export class RoleFilter extends BaseFilter implements IRoleFilter {
    keyword?: string;

    userAuth?: UserAuthenticated;
}
