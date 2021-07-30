import { Client } from '@domain/entities/user/Client';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { validateDataInput } from '@libs/common';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateClientCommandInput } from './UpdateClientCommandInput';
import { UpdateClientCommandOutput } from './UpdateClientCommandOutput';

@Service()
export class UpdateClientCommandHandler extends CommandHandler<UpdateClientCommandInput, UpdateClientCommandOutput> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string, param: UpdateClientCommandInput): Promise<UpdateClientCommandOutput> {
        await validateDataInput(param);

        const data = new Client();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;
        data.phone = param.phone;
        data.address = param.address;
        data.locale = param.locale;

        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._clientRepository.update(id, data);
        const result = new UpdateClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
