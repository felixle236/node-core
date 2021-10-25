import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { ActiveClientInput } from './ActiveClientInput';
import { ActiveClientOutput } from './ActiveClientOutput';

@Service()
export class ActiveClientHandler extends UsecaseHandler<ActiveClientInput, ActiveClientOutput> {
    constructor(
        @Inject('client.repository') private readonly _clientRepository: IClientRepository
    ) {
        super();
    }

    async handle(param: ActiveClientInput): Promise<ActiveClientOutput> {
        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.activeKey !== param.activeKey || client.status === ClientStatus.Actived)
            throw new SystemError(MessageError.DATA_INVALID);

        if (!client.activeExpire || client.activeExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, { t: 'activation_key' });

        const data = new Client();
        data.status = ClientStatus.Actived;
        data.activeKey = null;
        data.activedAt = new Date();

        const result = new ActiveClientOutput();
        result.data = await this._clientRepository.update(client.id, data);
        return result;
    }
}
