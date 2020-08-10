import { Inject, Service } from 'typedi';
import { IInteractor } from '../../domain/common/IInteractor';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { SystemError } from '../../domain/common/exceptions';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

@Service()
export class DeleteRoleInteractor implements IInteractor<number, boolean> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(id: number, userAuth: UserAuthenticated): Promise<boolean> {
        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (role.level <= userAuth.role.level)
            throw new SystemError(3);

        const hasSucceed = await this._roleRepository.delete(id);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return hasSucceed;
    }
}