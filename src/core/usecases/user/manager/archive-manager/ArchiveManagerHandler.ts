import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { ArchiveManagerOutput } from './ArchiveManagerOutput';

@Service()
export class ArchiveManagerHandler extends UsecaseHandler<string, ArchiveManagerOutput> {
    constructor(
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository
    ) {
        super();
    }

    async handle(id: string): Promise<ArchiveManagerOutput> {
        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new Manager();
        data.status = ManagerStatus.Archived;
        data.archivedAt = new Date();

        const result = new ArchiveManagerOutput();
        result.data = await this._managerRepository.update(id, data);
        return result;
    }
}
