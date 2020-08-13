import { Inject, Service } from 'typedi';
import { FindRoleCommonFilter } from './Filter';
import { FindRoleCommonOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../interfaces/repositories/IRoleRepository';
import { PaginationResult } from '../../../domain/common/outputs/PaginationResult';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindRoleCommonInteractor implements IInteractor<FindRoleCommonFilter, PaginationResult<FindRoleCommonOutput>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(filter: FindRoleCommonFilter, userAuth: UserAuthenticated): Promise<PaginationResult<FindRoleCommonOutput>> {
        filter.userAuth = userAuth;

        const [roles, count] = await this._roleRepository.findCommonAndCount(filter);
        const list = roles.map(role => new FindRoleCommonOutput(role));

        return new PaginationResult(list, count, filter.skip, filter.limit);
    }
}
