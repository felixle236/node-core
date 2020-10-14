import { Filter } from '../../../../domain/common/usecase/Filter';

export class FindRoleQuery extends Filter {
    keyword?: string;
}
