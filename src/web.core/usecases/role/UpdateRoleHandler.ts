import { Inject, Service } from 'typedi';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { IUseCaseHandler } from '../../domain/common/IUseCaseHandler';
import { Role } from '../../domain/entities/Role';
import { SystemError } from '../../domain/common/exceptions';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

@Service()
export class UpdateRoleHandler implements IUseCaseHandler {
    id: number;
    data: Role;
    userAuth: UserAuthenticated;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(): Promise<Role | undefined> {
        const role = await this._roleRepository.getById(this.id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (role.level <= this.userAuth.role.level || this.data.level <= this.userAuth.role.level)
            throw new SystemError(3);

        if (await this._roleRepository.checkNameExist(this.data.name, this.id))
            throw new SystemError(1005, 'name');

        const hasSucceed = await this._roleRepository.update(this.id, this.data);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return await this._roleRepository.getById(this.id);
    }
}
