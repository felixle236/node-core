import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetMyProfileClientData, GetMyProfileClientOutput } from './GetMyProfileClientOutput';

@Service()
export class GetMyProfileClientHandler implements IUsecaseHandler<string, GetMyProfileClientOutput> {
    constructor(
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(id: string): Promise<GetMyProfileClientOutput> {
        const client = await this._clientRepository.get(id);
        if (!client)
            throw new NotFoundError();

        const data = new GetMyProfileClientData();
        data.id = client.id;
        data.createdAt = client.createdAt;
        data.firstName = client.firstName;
        data.lastName = client.lastName;
        data.email = client.email;
        data.avatar = client.avatar;
        data.gender = client.gender;
        data.birthday = client.birthday;
        data.phone = client.phone;
        data.address = client.address;
        data.locale = client.locale;

        const result = new GetMyProfileClientOutput();
        result.data = data;
        return result;
    }
}
