import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../../domain/entities/Role';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateRoleCommand } from './UpdateRoleCommand';

@Service()
export class UpdateRoleCommandHandler implements ICommandHandler<UpdateRoleCommand, boolean> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: UpdateRoleCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.roleAuthLevel)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const data = new Role();
        data.name = param.name;
        data.level = param.level;

        const role = await this._roleRepository.getById(param.id);
        if (!role)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'role');

        if (role.level <= param.roleAuthLevel || data.level <= param.roleAuthLevel)
            throw new SystemError(MessageError.ACCESS_DENIED);

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
