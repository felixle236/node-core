import { Client } from '@domain/entities/user/Client';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateClientInput } from './UpdateClientInput';
import { UpdateClientOutput } from './UpdateClientOutput';

@Service()
export class UpdateClientHandler extends UsecaseHandler<UpdateClientInput, UpdateClientOutput> {
    constructor(
        @Inject('client.repository') private readonly _clientRepository: IClientRepository
    ) {
        super();
    }

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
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new UpdateClientOutput();
        result.data = await this._clientRepository.update(id, data);
        return result;
    }
}
