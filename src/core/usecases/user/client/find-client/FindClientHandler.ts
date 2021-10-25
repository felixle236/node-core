import { FindClientFilter, IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { FindClientInput } from './FindClientInput';
import { FindClientData, FindClientOutput } from './FindClientOutput';

@Service()
export class FindClientHandler extends UsecaseHandler<FindClientInput, FindClientOutput> {
    constructor(
        @Inject('client.repository') private readonly _clientRepository: IClientRepository
    ) {
        super();
    }

    async handle(param: FindClientInput): Promise<FindClientOutput> {
        const filter = new FindClientFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        filter.status = param.status;

        const [clients, count] = await this._clientRepository.findAndCount(filter);

        const result = new FindClientOutput();
        result.setPagination(count, param.skip, param.limit);
        result.data = clients.map(client => {
            const data = new FindClientData();
            data.id = client.id;
            data.createdAt = client.createdAt;
            data.firstName = client.firstName;
            if (client.lastName)
                data.lastName = client.lastName;
            data.email = client.email;
            if (client.avatar)
                data.avatar = client.avatar;
            if (client.gender)
                data.gender = client.gender;
            if (client.birthday)
                data.birthday = client.birthday;
            if (client.phone)
                data.phone = client.phone;
            if (client.address)
                data.address = client.address;
            if (client.locale)
                data.locale = client.locale;
            return data;
        });
        return result;
    }
}
