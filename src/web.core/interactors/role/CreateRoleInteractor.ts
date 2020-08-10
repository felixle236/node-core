import { Inject, Service } from 'typedi';
import { IInteractor } from '../../domain/common/IInteractor';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { Role } from '../../domain/entities/Role';
import { SystemError } from '../../domain/common/exceptions';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

export class RoleCreate {
    name: string;
    level: number;
}

@Service()
export class CreateRoleInteractor implements IInteractor<RoleCreate, number> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(param: RoleCreate, userAuth: UserAuthenticated): Promise<number> {
        const data = new Role();
        data.name = param.name;
        data.level = param.level;

        if (data.level <= userAuth.role.level)
            throw new SystemError(3);

        if (await this._roleRepository.checkNameExist(data.name))
            throw new SystemError(1005, 'name');

        const id = await this._roleRepository.create(data);
        if (!id)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return id;
    }
}
