import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class DeleteRoleInteractor implements IInteractor<number, BooleanResult> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(id: number, userAuth: UserAuthenticated): Promise<BooleanResult> {
        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'role');

        if (role.level <= userAuth.role.level)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const hasSucceed = await this._roleRepository.delete(id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._roleRepository.clearCaching();
        return new BooleanResult(hasSucceed);
    }
}
