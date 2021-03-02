import { Inject, Service } from 'typedi';
import { UpdateClientCommand } from './UpdateClientCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Client } from '../../../../domain/entities/client/Client';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';

@Service()
export class UpdateClientCommandHandler implements ICommandHandler<UpdateClientCommand, boolean> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: UpdateClientCommand): Promise<boolean> {
        if (param.roleAuthId !== RoleId.SUPER_ADMIN)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const id = param.id;
        const data = new Client();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;

        if (param.birthday)
            data.birthday = new Date(param.birthday);

        data.phone = param.phone;
        data.address = param.address;
        data.currency = param.currency;
        data.culture = param.culture;

        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._clientRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
