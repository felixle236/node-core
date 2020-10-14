import { Inject, Service } from 'typedi';
import { CreateRoleCommand } from './CreateRoleCommand';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../../domain/entities/role/Role';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class CreateRoleCommandHandler implements ICommandHandler<CreateRoleCommand, string> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: CreateRoleCommand): Promise<string> {
        const data = new Role();
        data.name = param.name;

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
