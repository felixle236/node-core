import { Inject, Service } from 'typedi';
import { CreateRoleCommand } from './CreateRoleCommand';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../../domain/entities/Role';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class CreateRoleCommandHandler implements ICommandHandler<CreateRoleCommand, string> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: CreateRoleCommand): Promise<string> {
        if (!param.roleAuthLevel)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const data = new Role();
        data.name = param.name;
        data.level = param.level;

        if (data.level <= param.roleAuthLevel)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const isExist = await this._roleRepository.checkNameExist(data.name);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const id = await this._roleRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._roleRepository.clearCaching();
        return id;
    }
}
