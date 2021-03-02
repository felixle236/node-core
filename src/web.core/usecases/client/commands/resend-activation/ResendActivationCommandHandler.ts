import * as crypto from 'crypto';
import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { ResendActivationCommand } from './ResendActivationCommand';
import { addSeconds } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Client } from '../../../../domain/entities/client/Client';
import { ClientStatus } from '../../../../domain/enums/client/ClientStatus';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';
import { IMailService } from '../../../../gateways/services/IMailService';

@Service()
export class ResendActivationCommandHandler implements ICommandHandler<ResendActivationCommand, boolean> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: ResendActivationCommand): Promise<boolean> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        if (!validator.isEmail(param.email))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        const client = await this._clientRepository.getByEmail(param.email);
        if (!client || client.status === ClientStatus.ACTIVED)
            throw new SystemError(MessageError.DATA_INVALID);

        const data = new Client();
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const hasSucceed = await this._clientRepository.update(client.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const name = `${client.firstName} ${client.lastName}`;
        this._mailService.resendUserActivation(name, client.email, data.activeKey);
        return hasSucceed;
    }
}
