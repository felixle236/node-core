import { randomUUID } from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { CreateAuthByEmailHandler } from '@usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from '@usecases/auth/auth/create-auth-by-email/CreateAuthByEmailInput';
import { CheckEmailExistHandler } from '@usecases/user/user/check-email-exist/CheckEmailExistHandler';
import { Inject, Service } from 'typedi';
import { CreateClientInput } from './CreateClientInput';
import { CreateClientOutput } from './CreateClientOutput';

@Service()
export class CreateClientHandler extends UsecaseHandler<CreateClientInput, CreateClientOutput> {
    constructor(
        @Inject() private readonly _checkEmailExistHandler: CheckEmailExistHandler,
        @Inject() private readonly _createAuthByEmailHandler: CreateAuthByEmailHandler,
        @Inject('db.context') private readonly _dbContext: IDbContext,
        @Inject('client.repository') private readonly _clientRepository: IClientRepository,
        @Inject('auth.repository') private readonly _authRepository: IAuthRepository
    ) {
        super();
    }

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
        auth.password = param.password;

        const checkEmailResult = await this._checkEmailExistHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const result = new CreateClientOutput();
            result.data = await this._clientRepository.create(data, queryRunner);

            const usecaseOption = new UsecaseOption();
            usecaseOption.queryRunner = queryRunner;
            await this._createAuthByEmailHandler.handle(auth, usecaseOption);
            return result;
        });
    }
}
