import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetClientData, GetClientOutput } from './GetClientOutput';

@Service()
export class GetClientHandler extends UsecaseHandler<string, GetClientOutput> {
    constructor(
        @Inject('client.repository') private readonly _clientRepository: IClientRepository
    ) {
        super();
    }

    async handle(id: string): Promise<GetClientOutput> {
        const client = await this._clientRepository.get(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new GetClientData();
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
        if (client.activedAt)
            data.activedAt = client.activedAt;
        if (client.archivedAt)
            data.archivedAt = client.archivedAt;

        const result = new GetClientOutput();
        result.data = data;
        return result;
    }
}
