import { Inject, Service } from 'typedi';
import { IInteractor } from '../../domain/common/IInteractor';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { SystemError } from '../../domain/common/exceptions';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

export class RoleDetailView {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    name: string;
    level: number;
}

@Service()
export class GetRoleByIdInteractor implements IInteractor<number, RoleDetailView> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(id: number, userAuth: UserAuthenticated): Promise<RoleDetailView> {
        const role = await this._roleRepository.getById(id);
        if (!role || role.level <= userAuth.role.level)
            throw new SystemError(4);

        const roleDetailView = new RoleDetailView();
        roleDetailView.id = role.id;
        roleDetailView.createdAt = role.createdAt;
        roleDetailView.updatedAt = role.updatedAt;
        roleDetailView.deletedAt = role.deletedAt;
        roleDetailView.name = role.name;
        roleDetailView.level = role.level;
        return roleDetailView;
    }
}
