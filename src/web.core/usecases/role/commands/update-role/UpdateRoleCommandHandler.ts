import { Inject, Service } from 'typedi';
import { UpdateRoleCommand } from './UpdateRoleCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Role } from '../../../../domain/entities/role/Role';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';

@Service()
export class UpdateRoleCommandHandler implements ICommandHandler<UpdateRoleCommand, boolean> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: UpdateRoleCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const data = new Role();
        data.name = param.name;

        const role = await this._roleRepository.getById(param.id);
        if (!role)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'role');

        const isExist = await this._roleRepository.checkNameExist(data.name, param.id);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const hasSucceed = await this._roleRepository.update(param.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._roleRepository.clearCaching();
        return hasSucceed;
    }
}
