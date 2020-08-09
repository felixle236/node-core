import { Inject, Service } from 'typedi';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { IUseCaseHandler } from '../../domain/common/IUseCaseHandler';
import { SystemError } from '../../domain/common/exceptions';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

@Service()
export class DeleteRoleHandler implements IUseCaseHandler {
    id: number;
    userAuth: UserAuthenticated;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(): Promise<boolean> {
        const role = await this._roleRepository.getById(this.id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (role.level <= this.userAuth.role.level)
            throw new SystemError(3);

        const hasSucceed = await this._roleRepository.delete(this.id);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return hasSucceed;
    }
}
