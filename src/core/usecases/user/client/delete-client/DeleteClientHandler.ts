import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { DeleteClientOutput } from './DeleteClientOutput';

@Service()
export class DeleteClientHandler extends UsecaseHandler<string, DeleteClientOutput> {
    constructor(
        @Inject('client.repository') private readonly _clientRepository: IClientRepository
    ) {
        super();
    }

    async handle(id: string): Promise<DeleteClientOutput> {
        const client = await this._clientRepository.get(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new DeleteClientOutput();
        result.data = await this._clientRepository.softDelete(id);
        return result;
    }
}
