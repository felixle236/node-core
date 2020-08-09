import { IFilterModel } from '../../../domain/common/inputs/IFilterModel';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';
import { UserStatus } from '../../../domain/enums/UserStatus';

export interface IUserFilter extends IFilterModel {
    keyword?: string;
    roleId?: number;
    status?: UserStatus;

    userAuth?: UserAuthenticated;
}
