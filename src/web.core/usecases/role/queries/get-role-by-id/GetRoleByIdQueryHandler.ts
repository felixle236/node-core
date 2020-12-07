import { Inject, Service } from 'typedi';
import { GetRoleByIdQuery } from './GetRoleByIdQuery';
import { GetRoleByIdQueryResult } from './GetRoleByIdQueryResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetRoleByIdQueryHandler implements IQueryHandler<GetRoleByIdQuery, GetRoleByIdQueryResult> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: GetRoleByIdQuery): Promise<GetRoleByIdQueryResult> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const role = await this._roleRepository.getById(param.id);
        if (!role)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        return new GetRoleByIdQueryResult(role);
    }
}
