import crypto, { randomUUID } from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IMailService } from '@gateways/services/IMailService';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { CreateAuthByEmailHandler } from '@usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from '@usecases/auth/auth/create-auth-by-email/CreateAuthByEmailInput';
import { CheckEmailExistHandler } from '@usecases/user/user/check-email-exist/CheckEmailExistHandler';
import { addSeconds } from '@utils/datetime';
import { Inject, Service } from 'typedi';
import { RegisterClientInput } from './RegisterClientInput';
import { RegisterClientOutput } from './RegisterClientOutput';

@Service()
export class RegisterClientHandler extends UsecaseHandler<RegisterClientInput, RegisterClientOutput> {
    constructor(
        @Inject() private readonly _checkEmailExistHandler: CheckEmailExistHandler,
        @Inject() private readonly _createAuthByEmailHandler: CreateAuthByEmailHandler,
        @Inject('db.context') private readonly _dbContext: IDbContext,
        @Inject('client.repository') private readonly _clientRepository: IClientRepository,
        @Inject('auth.repository') private readonly _authRepository: IAuthRepository,
        @Inject('mail.service') private readonly _mailService: IMailService
    ) {
        super();
    }

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
        auth.password = param.password;

        const checkEmailResult = await this._checkEmailExistHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        const activeKey = crypto.randomBytes(32).toString('hex');
        data.status = ClientStatus.Inactived;
        data.activeKey = activeKey;
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            await this._clientRepository.create(data, queryRunner);
            usecaseOption.queryRunner = queryRunner;
            await this._createAuthByEmailHandler.handle(auth, usecaseOption);

            const name = `${data.firstName} ${data.lastName}`;
            this._mailService.sendUserActivation(name, data.email, activeKey, usecaseOption.req.locale);

            const result = new RegisterClientOutput();
            result.data = true;
            return result;
        });
    }
}
