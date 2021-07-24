import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { ArchiveManagerCommandOutput } from './ArchiveManagerCommandOutput';

@Service()
export class ArchiveManagerCommandHandler extends CommandHandler<string, ArchiveManagerCommandOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string): Promise<ArchiveManagerCommandOutput> {
        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new Manager();
        data.status = ManagerStatus.ARCHIVED;
        data.archivedAt = new Date();

        const hasSucceed = await this._managerRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const result = new ArchiveManagerCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
