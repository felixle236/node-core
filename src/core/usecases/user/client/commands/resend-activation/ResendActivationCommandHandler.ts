import crypto from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IMailService } from '@gateways/services/IMailService';
import { validateDataInput } from '@libs/common';
import { addSeconds } from '@libs/date';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { ResendActivationCommandInput } from './ResendActivationCommandInput';
import { ResendActivationCommandOutput } from './ResendActivationCommandOutput';

@Service()
export class ResendActivationCommandHandler extends CommandHandler<ResendActivationCommandInput, ResendActivationCommandOutput> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: ResendActivationCommandInput): Promise<ResendActivationCommandOutput> {
        await validateDataInput(param);

        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.status === ClientStatus.ACTIVED)
            throw new SystemError(MessageError.DATA_INVALID);

        const data = new Client();
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        const hasSucceed = await this._clientRepository.update(client.id, data);

        const name = `${client.firstName} ${client.lastName}`;
        this._mailService.resendUserActivation(name, client.email, data.activeKey);

        const result = new ResendActivationCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
