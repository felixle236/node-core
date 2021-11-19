import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { DeleteClientOutput } from './DeleteClientOutput';

@Service()
export class DeleteClientHandler implements IUsecaseHandler<string, DeleteClientOutput> {
    constructor(
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(id: string): Promise<DeleteClientOutput> {
        const client = await this._clientRepository.get(id);
        if (!client)
            throw new NotFoundError();

        const result = new DeleteClientOutput();
        result.data = await this._clientRepository.softDelete(id);
        return result;
    }
}
