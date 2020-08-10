import { Inject, Service } from 'typedi';
import { BaseFilter } from '../../domain/common/inputs/BaseFilter';
import { IInteractor } from '../../domain/common/IInteractor';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { ResultList } from '../../domain/common/outputs/ResultList';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

export class RoleCommonFilter extends BaseFilter {
    keyword: string;
    userAuth: UserAuthenticated;
}

export class RoleCommonView {
    id: number;
    name: string;
}

@Service()
export class FindRoleCommonInteractor implements IInteractor<RoleCommonFilter, ResultList<RoleCommonView>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(filter: RoleCommonFilter, userAuth: UserAuthenticated): Promise<ResultList<RoleCommonView>> {
        filter.userAuth = userAuth;

        const [roles, count] = await this._roleRepository.findCommon(filter);
        const roleCommonViews = roles.map(role => {
            const roleCommonView = new RoleCommonView();
            roleCommonView.id = role.id;
            roleCommonView.name = role.name;
            return roleCommonView;
        });

        return new ResultList(roleCommonViews, count, filter.skip, filter.limit);
    }
}
