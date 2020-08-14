import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { Role } from '../../../domain/entities/Role';
import { SystemError } from '../../../domain/common/exceptions';
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
            throw new SystemError(1004, 'role');

        if (role.level <= userAuth.role.level || data.level <= userAuth.role.level)
            throw new SystemError(3);

        if (await this._roleRepository.checkNameExist(data.name, id))
            throw new SystemError(1005, 'name');

        const hasSucceed = await this._roleRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return new BooleanResult(hasSucceed);
    }
}
