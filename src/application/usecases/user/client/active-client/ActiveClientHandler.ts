import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { ActiveClientInput, ActiveClientOutput } from './ActiveClientSchema';

@Service()
export class ActiveClientHandler implements IUsecaseHandler<ActiveClientInput, ActiveClientOutput> {
  constructor(@Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository) {}

  async handle(param: ActiveClientInput): Promise<ActiveClientOutput> {
    const client = await this._clientRepository.getByEmail(param.email);
    if (!client || client.activeKey !== param.activeKey || client.status === ClientStatus.Actived) {
      throw new LogicalError(MessageError.DATA_INVALID);
    }

    if (!client.activeExpire || client.activeExpire < new Date()) {
      throw new LogicalError(MessageError.PARAM_EXPIRED, { t: 'activation_key' });
    }

    const data = new Client();
    data.status = ClientStatus.Actived;
    data.activedAt = new Date();
    data.activeKey = '';
    data.activeExpire = undefined;

    const result = new ActiveClientOutput();
    result.data = await this._clientRepository.update(client.id, data);
    return result;
  }
}
