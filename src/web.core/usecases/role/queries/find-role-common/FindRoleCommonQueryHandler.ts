import { Inject, Service } from 'typedi';
import { FindRoleCommonQuery } from './FindRoleCommonQuery';
import { FindRoleCommonQueryResult } from './FindRoleCommonQueryResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';

@Service()
export class FindRoleCommonQueryHandler implements IQueryHandler<FindRoleCommonQuery, PaginationResult<FindRoleCommonQueryResult>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: FindRoleCommonQuery): Promise<PaginationResult<FindRoleCommonQueryResult>> {
        const [roles, count] = await this._roleRepository.findCommonAndCount(param);
        const list = roles.map(role => new FindRoleCommonQueryResult(role));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
