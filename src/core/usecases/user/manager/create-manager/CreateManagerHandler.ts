import { randomUUID } from 'crypto';
import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { CreateAuthByEmailHandler } from '@usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from '@usecases/auth/auth/create-auth-by-email/CreateAuthByEmailInput';
import { CheckEmailExistHandler } from '@usecases/user/user/check-email-exist/CheckEmailExistHandler';
import { Inject, Service } from 'typedi';
import { CreateManagerInput } from './CreateManagerInput';
import { CreateManagerOutput } from './CreateManagerOutput';

@Service()
export class CreateManagerHandler extends UsecaseHandler<CreateManagerInput, CreateManagerOutput> {
    constructor(
        @Inject() private readonly _checkEmailExistHandler: CheckEmailExistHandler,
        @Inject() private readonly _createAuthByEmailHandler: CreateAuthByEmailHandler,
        @Inject('db.context') private readonly _dbContext: IDbContext,
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository,
        @Inject('auth.repository') private readonly _authRepository: IAuthRepository
    ) {
        super();
    }

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
        auth.password = param.password;

        const checkEmailResult = await this._checkEmailExistHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const result = new CreateManagerOutput();
            result.data = await this._managerRepository.create(data, queryRunner);

            const usecaseOption = new UsecaseOption();
            usecaseOption.queryRunner = queryRunner;
            await this._createAuthByEmailHandler.handle(auth, usecaseOption);
            return result;
        });
    }
}
