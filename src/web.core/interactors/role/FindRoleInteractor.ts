import { Inject, Service } from 'typedi';
import { BaseFilter } from '../../domain/common/inputs/BaseFilter';
import { IInteractor } from '../../domain/common/IInteractor';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { ResultList } from '../../domain/common/outputs/ResultList';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

export class RoleFilter extends BaseFilter {
    keyword: string;
    userAuth: UserAuthenticated;
}

export class RoleView {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    name: string;
    level: number;
}

@Service()
export class FindRoleInteractor implements IInteractor<RoleFilter, ResultList<RoleView>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(filter: RoleFilter, userAuth: UserAuthenticated): Promise<ResultList<RoleView>> {
        filter.userAuth = userAuth;

        const [roles, count] = await this._roleRepository.find(filter);
        const roleViews = roles.map(role => {
            const roleView = new RoleView();
            roleView.id = role.id;
            roleView.createdAt = role.createdAt;
            roleView.updatedAt = role.updatedAt;
            roleView.deletedAt = role.deletedAt;
            roleView.name = role.name;
            roleView.level = role.level;
            return roleView;
        });

        return new ResultList(roleViews, count, filter.skip, filter.limit);
    }
}
