import { Client } from 'domain/entities/user/Client';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateClientInput } from './UpdateClientInput';
import { UpdateClientOutput } from './UpdateClientOutput';

@Service()
export class UpdateClientHandler implements IUsecaseHandler<UpdateClientInput, UpdateClientOutput> {
    constructor(
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(id: string, param: UpdateClientInput): Promise<UpdateClientOutput> {
        const data = new Client();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;
        data.phone = param.phone;
        data.address = param.address;
        data.locale = param.locale;

        const client = await this._clientRepository.get(id);
        if (!client)
            throw new NotFoundError();

        const result = new UpdateClientOutput();
        result.data = await this._clientRepository.update(id, data);
        return result;
    }
}
