import { Inject, Service } from 'typedi';
import { FindRoleCommonQuery } from './FindRoleCommonQuery';
import { FindRoleCommonResult } from './FindRoleCommonResult';
import { IQueryHandler } from '../../../../domain/common/interactor/interfaces/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { PaginationResult } from '../../../../domain/common/interactor/PaginationResult';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class FindRoleCommonQueryHandler implements IQueryHandler<FindRoleCommonQuery, PaginationResult<FindRoleCommonResult>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: FindRoleCommonQuery): Promise<PaginationResult<FindRoleCommonResult>> {
        if (!param.roleAuthLevel)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const [roles, count] = await this._roleRepository.findCommonAndCount(param);
        const list = roles.map(role => new FindRoleCommonResult(role));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
