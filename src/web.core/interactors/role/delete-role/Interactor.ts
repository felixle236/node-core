import { Inject, Service } from 'typedi';
import { DeleteRoleOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../interfaces/repositories/IRoleRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class DeleteRoleInteractor implements IInteractor<number, DeleteRoleOutput> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(id: number, userAuth: UserAuthenticated): Promise<DeleteRoleOutput> {
        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (role.level <= userAuth.role.level)
            throw new SystemError(3);

        const hasSucceed = await this._roleRepository.delete(id);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return new DeleteRoleOutput(hasSucceed);
    }
}
