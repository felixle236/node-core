import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../domain/entities/Role';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UpdateRoleInput } from './Input';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UpdateRoleInteractor implements IInteractor<UpdateRoleInput, BooleanResult> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(param: UpdateRoleInput, userAuth: UserAuthenticated): Promise<BooleanResult> {
        const id = param.id;
        const data = new Role();
        data.name = param.name;
        data.level = param.level;

        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'role');

        if (role.level <= userAuth.role.level || data.level <= userAuth.role.level)
            throw new SystemError(MessageError.ACCESS_DENIED);

        if (await this._roleRepository.checkNameExist(data.name, id))
            throw new SystemError(MessageError.PARAM_EXISTED, 'name');

        const hasSucceed = await this._roleRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._roleRepository.clearCaching();
        return new BooleanResult(hasSucceed);
    }
}
