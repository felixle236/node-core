import crypto from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IMailService } from '@gateways/services/IMailService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { addSeconds } from '@utils/datetime';
import { Inject, Service } from 'typedi';
import { ResendActivationInput } from './ResendActivationInput';
import { ResendActivationOutput } from './ResendActivationOutput';

@Service()
export class ResendActivationHandler extends UsecaseHandler<ResendActivationInput, ResendActivationOutput> {
    constructor(
        @Inject('client.repository') private readonly _clientRepository: IClientRepository,
        @Inject('mail.service') private readonly _mailService: IMailService
    ) {
        super();
    }

    async handle(param: ResendActivationInput, usecaseOption: UsecaseOption): Promise<ResendActivationOutput> {
        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.status === ClientStatus.Actived)
            throw new SystemError(MessageError.DATA_INVALID);

        const data = new Client();
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
        const hasSucceed = await this._clientRepository.update(client.id, data);

        const name = `${client.firstName} ${client.lastName}`;
        this._mailService.resendUserActivation(name, client.email, data.activeKey, usecaseOption.req.locale);

        const result = new ResendActivationOutput();
        result.data = hasSucceed;
        return result;
    }
}
