import { Inject, Service } from 'typedi';
import { FindRoleQuery } from './FindRoleQuery';
import { FindRoleResult } from './FindRoleResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';

@Service()
export class FindRoleQueryHandler implements IQueryHandler<FindRoleQuery, PaginationResult<FindRoleResult>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: FindRoleQuery): Promise<PaginationResult<FindRoleResult>> {
        const [roles, count] = await this._roleRepository.findAndCount(param);
        const list = roles.map(role => new FindRoleResult(role));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
