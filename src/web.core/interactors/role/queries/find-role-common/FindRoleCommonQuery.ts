import { Filter } from '../../../../domain/common/interactor/Filter';

export class FindRoleCommonQuery extends Filter {
    keyword?: string;

    roleAuthLevel: number;
}
