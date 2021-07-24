import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { DeleteClientCommandOutput } from './DeleteClientCommandOutput';

@Service()
export class DeleteClientCommandHandler extends CommandHandler<string, DeleteClientCommandOutput> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string): Promise<DeleteClientCommandOutput> {
        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._clientRepository.softDelete(id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const result = new DeleteClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
