import { IFilterModel } from '../../../domain/common/inputs/IFilterModel';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

export interface IRoleFilter extends IFilterModel {
    keyword?: string;

    userAuth?: UserAuthenticated;
}
