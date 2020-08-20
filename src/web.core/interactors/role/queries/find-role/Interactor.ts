import { Inject, Service } from 'typedi';
import { FindRoleFilter } from './Filter';
import { FindRoleOutput } from './Output';
import { IQueryHandler } from '../../../../domain/common/interactor/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { PaginationResult } from '../../../../domain/common/outputs/PaginationResult';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';

@Service()
export class FindRoleInteractor implements IQueryHandler<FindRoleFilter, PaginationResult<FindRoleOutput>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(filter: FindRoleFilter, userAuth: UserAuthenticated): Promise<PaginationResult<FindRoleOutput>> {
        filter.userAuth = userAuth;

        const [roles, count] = await this._roleRepository.findAndCount(filter);
        const list = roles.map(role => new FindRoleOutput(role));

        return new PaginationResult(list, count, filter.skip, filter.limit);
    }
}
