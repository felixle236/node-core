import crypto from 'crypto';
import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IMailService } from 'application/interfaces/services/IMailService';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { addSeconds } from 'utils/Datetime';
import { ResendActivationInput, ResendActivationOutput } from './ResendActivationSchema';

@Service()
export class ResendActivationHandler implements IUsecaseHandler<ResendActivationInput, ResendActivationOutput> {
  constructor(
    @Inject(InjectService.Mail) private readonly _mailService: IMailService,
    @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository,
  ) {}

  async handle(param: ResendActivationInput, usecaseOption: UsecaseOption): Promise<ResendActivationOutput> {
    const client = await this._clientRepository.getByEmail(param.email);
    if (!client || client.status !== ClientStatus.Unverified) {
      throw new LogicalError(MessageError.DATA_INVALID);
    }

    const data = new Client();
    data.activeKey = crypto.randomBytes(32).toString('hex');
    data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);
    const hasSucceed = await this._clientRepository.update(client.id, data);

    const name = `${client.firstName} ${client.lastName}`;
    this._mailService.resendUserActivation({ name, email: client.email, activeKey: data.activeKey, locale: usecaseOption.locale });

    const result = new ResendActivationOutput();
    result.data = hasSucceed;
    return result;
  }
}
