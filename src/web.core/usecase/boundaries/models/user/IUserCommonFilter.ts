import { IFilterModel } from '../../../../domain/common/inputs/IFilterModel';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';

export interface IUserCommonFilter extends IFilterModel {
    keyword?: string;
    roleId?: number;

    userAuth?: UserAuthenticated;
}
