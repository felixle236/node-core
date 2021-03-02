import { Inject, Service } from 'typedi';
import { DeleteManagerCommand } from './DeleteManagerCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';

@Service()
export class DeleteManagerCommandHandler implements ICommandHandler<DeleteManagerCommand, boolean> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: DeleteManagerCommand): Promise<boolean> {
        if (param.roleAuthId !== RoleId.SUPER_ADMIN)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const manager = await this._managerRepository.getById(param.id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._managerRepository.softDelete(param.id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
