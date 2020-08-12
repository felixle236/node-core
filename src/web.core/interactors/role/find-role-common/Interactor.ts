import { Inject, Service } from 'typedi';
import { FindRoleCommonFilter } from './Filter';
import { FindRoleCommonOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../interfaces/repositories/IRoleRepository';
import { ResultList } from '../../../domain/common/outputs/ResultList';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindRoleCommonInteractor implements IInteractor<FindRoleCommonFilter, ResultList<FindRoleCommonOutput>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(filter: FindRoleCommonFilter, userAuth: UserAuthenticated): Promise<ResultList<FindRoleCommonOutput>> {
        filter.userAuth = userAuth;

        const [roles, count] = await this._roleRepository.findCommonAndCount(filter);
        const list = roles.map(role => new FindRoleCommonOutput(role));

        return new ResultList(list, count, filter.skip, filter.limit);
    }
}
