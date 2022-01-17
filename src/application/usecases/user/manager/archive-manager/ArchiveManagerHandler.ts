import { Manager } from 'domain/entities/user/Manager';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { ArchiveManagerOutput } from './ArchiveManagerSchema';

@Service()
export class ArchiveManagerHandler implements IUsecaseHandler<string, ArchiveManagerOutput> {
  constructor(@Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository) {}

  async handle(id: string): Promise<ArchiveManagerOutput> {
    const manager = await this._managerRepository.get(id);
    if (!manager) {
      throw new NotFoundError();
    }

    const data = new Manager();
    data.status = ManagerStatus.Archived;
    data.archivedAt = new Date();

    const result = new ArchiveManagerOutput();
    result.data = await this._managerRepository.update(id, data);
    return result;
  }
}
