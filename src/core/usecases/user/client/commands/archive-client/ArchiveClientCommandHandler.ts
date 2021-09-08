import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { ArchiveClientCommandOutput } from './ArchiveClientCommandOutput';

@Service()
export class ArchiveClientCommandHandler extends CommandHandler<string, ArchiveClientCommandOutput> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string): Promise<ArchiveClientCommandOutput> {
        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new Client();
        data.status = ClientStatus.Archived;
        data.archivedAt = new Date();

        const hasSucceed = await this._clientRepository.update(id, data);
        const result = new ArchiveClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
