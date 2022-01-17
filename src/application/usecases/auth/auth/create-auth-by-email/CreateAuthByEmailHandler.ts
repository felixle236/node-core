import { Auth } from 'domain/entities/auth/Auth';
import { AuthType } from 'domain/enums/auth/AuthType';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { CreateAuthByEmailInput, CreateAuthByEmailOutput } from './CreateAuthByEmailSchema';

@Service()
export class CreateAuthByEmailHandler implements IUsecaseHandler<CreateAuthByEmailInput, CreateAuthByEmailOutput> {
  constructor(@Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository) {}

  async handle(param: CreateAuthByEmailInput, usecaseOption: UsecaseOption): Promise<CreateAuthByEmailOutput> {
    const data = new Auth();
    data.type = AuthType.PersonalEmail;
    data.userId = param.userId;
    data.username = param.email;
    data.password = Auth.hashPassword(param.password);

    const auths = await this._authRepository.getAllByUser(param.userId, usecaseOption.querySession);
    if (auths && auths.find((auth) => auth.type === AuthType.PersonalEmail)) {
      throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'data' });
    }

    const result = new CreateAuthByEmailOutput();
    result.data = await this._authRepository.create(data, usecaseOption.querySession);
    return result;
  }
}
