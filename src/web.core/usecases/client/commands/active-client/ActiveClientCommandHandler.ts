import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { ActiveClientCommand } from './ActiveClientCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Client } from '../../../../domain/entities/client/Client';
import { ClientStatus } from '../../../../domain/enums/client/ClientStatus';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';

@Service()
export class ActiveClientCommandHandler implements ICommandHandler<ActiveClientCommand, boolean> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: ActiveClientCommand): Promise<boolean> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        if (!validator.isEmail(param.email))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        if (!param.activeKey)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'activation key');

        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.activeKey !== param.activeKey || client.status === ClientStatus.ACTIVED)
            throw new SystemError(MessageError.DATA_INVALID);

        if (!client.activeExpire || client.activeExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, 'activation key');

        const data = new Client();
        data.status = ClientStatus.ACTIVED;
        data.activeKey = '';
        data.activedAt = new Date();

        const hasSucceed = await this._clientRepository.update(client.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
