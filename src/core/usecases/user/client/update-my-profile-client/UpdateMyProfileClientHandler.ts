import { Client } from '@domain/entities/user/Client';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateMyProfileClientInput } from './UpdateMyProfileClientInput';
import { UpdateMyProfileClientOutput } from './UpdateMyProfileClientOutput';

@Service()
export class UpdateMyProfileClientHandler extends UsecaseHandler<UpdateMyProfileClientInput, UpdateMyProfileClientOutput> {
    constructor(
        @Inject('client.repository') private readonly _clientRepository: IClientRepository
    ) {
        super();
    }

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
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new UpdateMyProfileClientOutput();
        result.data = await this._clientRepository.update(id, data);
        return result;
    }
}
