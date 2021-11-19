import { Client } from 'domain/entities/user/Client';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateMyProfileClientInput } from './UpdateMyProfileClientInput';
import { UpdateMyProfileClientOutput } from './UpdateMyProfileClientOutput';

@Service()
export class UpdateMyProfileClientHandler implements IUsecaseHandler<UpdateMyProfileClientInput, UpdateMyProfileClientOutput> {
    constructor(
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(id: string, param: UpdateMyProfileClientInput): Promise<UpdateMyProfileClientOutput> {
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

        const result = new UpdateMyProfileClientOutput();
        result.data = await this._clientRepository.update(id, data);
        return result;
    }
}
