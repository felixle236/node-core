import { Filter } from '../../../../domain/common/interactor/Filter';
import { UserStatus } from '../../../../domain/enums/UserStatus';

export class FindUserQuery extends Filter {
    keyword?: string;
    roleId?: string;
    status?: UserStatus;

    roleAuthLevel: number;
}
