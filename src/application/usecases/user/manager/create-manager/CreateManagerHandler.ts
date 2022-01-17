import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Manager } from 'domain/entities/user/Manager';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { CreateAuthByEmailHandler } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailInput';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb, InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { CreateManagerInput } from './CreateManagerInput';
import { CreateManagerOutput } from './CreateManagerOutput';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';

@Service()
export class CreateManagerHandler implements IUsecaseHandler<CreateManagerInput, CreateManagerOutput> {
  constructor(
    @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
    private readonly _checkEmailExistHandler: CheckEmailExistHandler,
    private readonly _createAuthByEmailHandler: CreateAuthByEmailHandler,
    @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository,
    @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
  ) {}

  async handle(param: CreateManagerInput): Promise<CreateManagerOutput> {
    const data = new Manager();
    data.id = randomUUID();
    data.roleId = RoleId.Manager;
    data.status = ManagerStatus.Actived;
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

    return await this._dbContext.runTransaction(async (querySession) => {
      const result = new CreateManagerOutput();
      result.data = await this._managerRepository.create(data, querySession);

      const usecaseOption = new UsecaseOption();
      usecaseOption.querySession = querySession;
      await this._createAuthByEmailHandler.handle(auth, usecaseOption);
      return result;
    });
  }
}
