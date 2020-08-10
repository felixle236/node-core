import { Inject, Service } from 'typedi';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { IUseCase } from '../../domain/common/IUseCase';
import { Role } from '../../domain/entities/Role';
import { SystemError } from '../../domain/common/exceptions';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

@Service()
export class CreateRoleUseCase implements IUseCase {
    data: Role;
    userAuth: UserAuthenticated;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(): Promise<Role | undefined> {
        if (this.data.level <= this.userAuth.role.level)
            throw new SystemError(3);

        if (await this._roleRepository.checkNameExist(this.data.name))
            throw new SystemError(1005, 'name');

        const id = await this._roleRepository.create(this.data);
        if (!id)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return await this._roleRepository.getById(id);
    }
}
