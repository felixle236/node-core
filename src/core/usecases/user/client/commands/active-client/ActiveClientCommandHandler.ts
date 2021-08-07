import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { validateDataInput } from '@libs/common';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { ActiveClientCommandInput } from './ActiveClientCommandInput';
import { ActiveClientCommandOutput } from './ActiveClientCommandOutput';

@Service()
export class ActiveClientCommandHandler extends CommandHandler<ActiveClientCommandInput, ActiveClientCommandOutput> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(param: ActiveClientCommandInput): Promise<ActiveClientCommandOutput> {
        await validateDataInput(param);

        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.activeKey !== param.activeKey || client.status === ClientStatus.ACTIVED)
            throw new SystemError(MessageError.DATA_INVALID);

        if (!client.activeExpire || client.activeExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, 'activation key');

        const data = new Client();
        data.status = ClientStatus.ACTIVED;
        data.activeKey = null;
        data.activedAt = new Date();

        const hasSucceed = await this._clientRepository.update(client.id, data);
        const result = new ActiveClientCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
