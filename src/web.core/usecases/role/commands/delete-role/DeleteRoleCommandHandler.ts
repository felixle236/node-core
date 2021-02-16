import { Inject, Service } from 'typedi';
import { DeleteRoleCommand } from './DeleteRoleCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';

@Service()
export class DeleteRoleCommandHandler implements ICommandHandler<DeleteRoleCommand, boolean> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: DeleteRoleCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const role = await this._roleRepository.getById(param.id);
        if (!role)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'role');

        const hasSucceed = await this._roleRepository.softDelete(param.id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._roleRepository.clearCaching();
        return hasSucceed;
    }
}
