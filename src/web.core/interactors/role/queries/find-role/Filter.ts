import { BaseFilter } from '../../../../domain/common/inputs/BaseFilter';
import { IInput } from '../../../../domain/common/interactor/IInput';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';

export class FindRoleFilter extends BaseFilter implements IInput {
    keyword?: string;
    userAuth: UserAuthenticated;
}
