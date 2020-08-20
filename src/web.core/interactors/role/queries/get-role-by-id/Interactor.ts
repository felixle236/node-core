import { Inject, Service } from 'typedi';
import { GetRoleByIdOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class GetRoleByIdInteractor implements IInteractor<string, GetRoleByIdOutput> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(id: string, userAuth: UserAuthenticated): Promise<GetRoleByIdOutput> {
        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(MessageError.DATA_NOT_FOUND);
        if (role.level < userAuth.role.level)
            throw new SystemError(MessageError.ACCESS_DENIED);

        return new GetRoleByIdOutput(role);
    }
}
