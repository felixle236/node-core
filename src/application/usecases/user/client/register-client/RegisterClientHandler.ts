import { randomBytes, randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IMailService } from 'application/interfaces/services/IMailService';
import { CreateAuthByEmailHandler } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailSchema';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb, InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { addSeconds } from 'utils/Datetime';
import { RegisterClientInput, RegisterClientOutput } from './RegisterClientSchema';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';

@Service()
export class RegisterClientHandler implements IUsecaseHandler<RegisterClientInput, RegisterClientOutput> {
  constructor(
    @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
    @Inject(InjectService.Mail) private readonly _mailService: IMailService,
    private readonly _checkEmailExistHandler: CheckEmailExistHandler,
    private readonly _createAuthByEmailHandler: CreateAuthByEmailHandler,
    @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository,
    @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
  ) {}

  async handle(param: RegisterClientInput, usecaseOption: UsecaseOption): Promise<RegisterClientOutput> {
    const data = new Client();
    data.id = randomUUID();
    data.roleId = RoleId.Client;
    data.firstName = param.firstName;
    data.lastName = param.lastName;
    data.email = param.email;

    const auth = new CreateAuthByEmailInput();
    auth.userId = data.id;
    auth.email = data.email;

    Auth.validatePassword(param.password);
    auth.password = param.password;

    const checkEmailResult = await this._checkEmailExistHandler.handle(data.email);
    if (checkEmailResult.data) {
      throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });
    }

    const isExistUsername = await this._authRepository.getByUsername(data.email);
    if (isExistUsername) {
      throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });
    }

    const activeKey = randomBytes(32).toString('hex');
    data.status = ClientStatus.Unverified;
    data.activeKey = activeKey;
    data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

    return await this._dbContext.runTransaction(async (querySession) => {
      await this._clientRepository.create(data, querySession);
      usecaseOption.querySession = querySession;
      await this._createAuthByEmailHandler.handle(auth, usecaseOption);

      const name = `${data.firstName} ${data.lastName}`;
      this._mailService.sendUserActivation({ name, email: data.email, activeKey, locale: usecaseOption.locale });

      const result = new RegisterClientOutput();
      result.data = true;
      return result;
    });
  }
}
