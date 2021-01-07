import { Inject, Service } from 'typedi';
import { CreateRoleCommand } from './CreateRoleCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Role } from '../../../../domain/entities/role/Role';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';

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
