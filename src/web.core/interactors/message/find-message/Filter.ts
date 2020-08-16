import { BaseFilter } from '../../../domain/common/inputs/BaseFilter';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

export class FindMessageFilter extends BaseFilter {
    keyword?: string;
    room?: number;
    receiverId?: number;
    userAuth: UserAuthenticated;
}
