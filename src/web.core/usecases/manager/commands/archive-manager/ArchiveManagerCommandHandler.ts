import { Inject, Service } from 'typedi';
import { ArchiveManagerCommand } from './ArchiveManagerCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Manager } from '../../../../domain/entities/manager/Manager';
import { ManagerStatus } from '../../../../domain/enums/manager/ManagerStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';

@Service()
export class ArchiveManagerCommandHandler implements ICommandHandler<ArchiveManagerCommand, boolean> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: ArchiveManagerCommand): Promise<boolean> {
        if (param.roleAuthId !== RoleId.SUPER_ADMIN)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const manager = await this._managerRepository.getById(param.id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new Manager();
        data.status = ManagerStatus.ARCHIVED;
        data.archivedAt = new Date();

        const hasSucceed = await this._managerRepository.update(param.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
