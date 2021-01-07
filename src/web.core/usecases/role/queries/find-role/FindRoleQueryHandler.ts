import { Inject, Service } from 'typedi';
import { FindRoleQuery } from './FindRoleQuery';
import { FindRoleQueryResult } from './FindRoleQueryResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';

@Service()
export class FindRoleQueryHandler implements IQueryHandler<FindRoleQuery, PaginationResult<FindRoleQueryResult>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: FindRoleQuery): Promise<PaginationResult<FindRoleQueryResult>> {
        const [roles, count] = await this._roleRepository.findAndCount(param);
        const list = roles.map(role => new FindRoleQueryResult(role));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
