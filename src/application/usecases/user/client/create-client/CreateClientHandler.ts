import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { CreateAuthByEmailHandler } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailInput';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectDb, InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { CreateClientInput } from './CreateClientInput';
import { CreateClientOutput } from './CreateClientOutput';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';

@Service()
export class CreateClientHandler implements IUsecaseHandler<CreateClientInput, CreateClientOutput> {
    constructor(
        @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
        @Inject() private readonly _checkEmailExistHandler: CheckEmailExistHandler,
        @Inject() private readonly _createAuthByEmailHandler: CreateAuthByEmailHandler,
        @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository
    ) {}

    async handle(param: CreateClientInput): Promise<CreateClientOutput> {
        const data = new Client();
        data.id = randomUUID();
        data.roleId = RoleId.Client;
        data.status = ClientStatus.Actived;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;
        data.gender = param.gender;
        data.birthday = param.birthday;
        data.phone = param.phone;
        data.address = param.address;
        data.locale = param.locale;

        const auth = new CreateAuthByEmailInput();
        auth.userId = data.id;
        auth.email = data.email;

        Auth.validatePassword(param.password);
        auth.password = param.password;

        const checkEmailResult = await this._checkEmailExistHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

        return await this._dbContext.runTransaction(async querySession => {
            const result = new CreateClientOutput();
            result.data = await this._clientRepository.create(data, querySession);

            const usecaseOption = new UsecaseOption();
            usecaseOption.querySession = querySession;
            await this._createAuthByEmailHandler.handle(auth, usecaseOption);
            return result;
        });
    }
}
