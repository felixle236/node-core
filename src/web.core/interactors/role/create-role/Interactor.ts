import { Inject, Service } from 'typedi';
import { CreateRoleInput } from './Input';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { IdentityResult } from '../../../domain/common/outputs/IdentityResult';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../domain/entities/Role';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class CreateRoleInteractor implements IInteractor<CreateRoleInput, IdentityResult<string>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: CreateRoleInput, userAuth: UserAuthenticated): Promise<IdentityResult<string>> {
        const data = new Role();
        data.name = param.name;
        data.level = param.level;

        if (data.level <= userAuth.role.level)
            throw new SystemError(MessageError.ACCESS_DENIED);

        if (await this._roleRepository.checkNameExist(data.name))
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const id = await this._roleRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._roleRepository.clearCaching();
        return new IdentityResult(id);
    }
}
