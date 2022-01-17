import { randomBytes } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { IMailService } from 'application/interfaces/services/IMailService';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { addSeconds } from 'utils/Datetime';
import { ForgotPasswordByEmailInput, ForgotPasswordByEmailOutput } from './ForgotPasswordByEmailSchema';

@Service()
export class ForgotPasswordByEmailHandler implements IUsecaseHandler<ForgotPasswordByEmailInput, ForgotPasswordByEmailOutput> {
  constructor(
    @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
    @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository,
    @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository,
    @Inject(InjectService.Mail) private readonly _mailService: IMailService,
  ) {}

  async handle(param: ForgotPasswordByEmailInput, usecaseOption: UsecaseOption): Promise<ForgotPasswordByEmailOutput> {
    const auth = await this._authRepository.getByUsername(param.email);
    if (!auth || !auth.user) {
      throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });
    }

    if (auth.user.roleId === RoleId.Client) {
      const client = await this._clientRepository.get(auth.userId);
      if (!client) {
        throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });
      }
      if (client.status !== ClientStatus.Actived) {
        throw new LogicalError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });
      }
    } else {
      const manager = await this._managerRepository.get(auth.userId);
      if (!manager) {
        throw new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });
      }
      if (manager.status !== ManagerStatus.Actived) {
        throw new LogicalError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });
      }
    }

    const data = new Auth();
    data.forgotKey = randomBytes(32).toString('hex');
    data.forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

    const result = new ForgotPasswordByEmailOutput();
    result.data = await this._authRepository.update(auth.id, data);

    const name = `${auth.user.firstName} ${auth.user.lastName}`;
    this._mailService.sendForgotPassword({ name, email: param.email, forgotKey: data.forgotKey, locale: usecaseOption.locale });

    return result;
  }
}
