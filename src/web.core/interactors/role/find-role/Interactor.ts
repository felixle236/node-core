import { Inject, Service } from 'typedi';
import { FindRoleFilter } from './Filter';
import { FindRoleOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../interfaces/repositories/IRoleRepository';
import { ResultList } from '../../../domain/common/outputs/ResultList';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindRoleInteractor implements IInteractor<FindRoleFilter, ResultList<FindRoleOutput>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(filter: FindRoleFilter, userAuth: UserAuthenticated): Promise<ResultList<FindRoleOutput>> {
        filter.userAuth = userAuth;

        const [roles, count] = await this._roleRepository.findAndCount(filter);
        const list = roles.map(role => new FindRoleOutput(role));

        return new ResultList(list, count, filter.skip, filter.limit);
    }
}
