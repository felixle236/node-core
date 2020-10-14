import { Inject, Service } from 'typedi';
import { FindRoleCommonQuery } from './FindRoleCommonQuery';
import { FindRoleCommonResult } from './FindRoleCommonResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';

@Service()
export class FindRoleCommonQueryHandler implements IQueryHandler<FindRoleCommonQuery, PaginationResult<FindRoleCommonResult>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: FindRoleCommonQuery): Promise<PaginationResult<FindRoleCommonResult>> {
        const [roles, count] = await this._roleRepository.findCommonAndCount(param);
        const list = roles.map(role => new FindRoleCommonResult(role));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
