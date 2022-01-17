import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { ArchiveClientOutput } from './ArchiveClientSchema';

@Service()
export class ArchiveClientHandler implements IUsecaseHandler<string, ArchiveClientOutput> {
  constructor(@Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository) {}

  async handle(id: string): Promise<ArchiveClientOutput> {
    const client = await this._clientRepository.get(id);
    if (!client) {
      throw new NotFoundError();
    }

    const data = new Client();
    data.status = ClientStatus.Archived;
    data.archivedAt = new Date();

    const result = new ArchiveClientOutput();
    result.data = await this._clientRepository.update(id, data);
    return result;
  }
}
