import { Inject, Service } from 'typedi';
import { GetRoleByIdOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class GetRoleByIdInteractor implements IInteractor<number, GetRoleByIdOutput> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(id: number, userAuth: UserAuthenticated): Promise<GetRoleByIdOutput> {
        const role = await this._roleRepository.getById(id);
        if (!role || role.level <= userAuth.role.level)
            throw new SystemError(4);

        return new GetRoleByIdOutput(role);
    }
}
