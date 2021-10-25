import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { ArchiveClientOutput } from './ArchiveClientOutput';

@Service()
export class ArchiveClientHandler extends UsecaseHandler<string, ArchiveClientOutput> {
    constructor(
        @Inject('client.repository') private readonly _clientRepository: IClientRepository
    ) {
        super();
    }

    async handle(id: string): Promise<ArchiveClientOutput> {
        const client = await this._clientRepository.get(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new Client();
        data.status = ClientStatus.Archived;
        data.archivedAt = new Date();

        const result = new ArchiveClientOutput();
        result.data = await this._clientRepository.update(id, data);
        return result;
    }
}
