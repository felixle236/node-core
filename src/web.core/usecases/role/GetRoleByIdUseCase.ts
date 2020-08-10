import { Inject, Service } from 'typedi';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { IUseCase } from '../../domain/common/IUseCase';
import { Role } from '../../domain/entities/Role';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

@Service()
export class GetRoleByIdUseCase implements IUseCase {
    id: number;
    userAuth: UserAuthenticated;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(): Promise<Role | undefined> {
        const role = await this._roleRepository.getById(this.id);
        if (!role || role.level <= this.userAuth.role.level)
            return;
        return role;
    }
}
