import { randomUUID } from 'crypto';
import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IManager } from '@domain/interfaces/user/IManager';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IDbContext } from '@shared/database/interfaces/IDbContext';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { HandleOption } from '@shared/usecase/HandleOption';
import { CreateAuthByEmailCommandHandler } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';
import { CreateAuthByEmailCommandInput } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandInput';
import { CheckEmailExistQueryHandler } from '@usecases/user/user/queries/check-email-exist/CheckEmailExistQueryHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateManagerCommandInput } from './CreateManagerCommandInput';
import { CreateManagerCommandOutput } from './CreateManagerCommandOutput';

@Service()
export class CreateManagerCommandHandler extends CommandHandler<CreateManagerCommandInput, CreateManagerCommandOutput> {
    @Inject()
    private readonly _checkEmailExistQueryHandler: CheckEmailExistQueryHandler;

    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('db.context')
    private readonly _dbContext: IDbContext;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: CreateManagerCommandInput): Promise<CreateManagerCommandOutput> {
        await validateDataInput(param);

        const data = new Manager({ id: randomUUID() } as IManager);
        data.roleId = RoleId.Manager;
        data.status = ManagerStatus.Actived;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const auth = new CreateAuthByEmailCommandInput();
        auth.userId = data.id;
        auth.email = data.email;
        auth.password = param.password;

        const checkEmailResult = await this._checkEmailExistQueryHandler.handle(data.email);
        if (checkEmailResult.data)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        return await this._dbContext.getConnection().runTransaction(async queryRunner => {
            const id = await this._managerRepository.create(data, queryRunner);
            const result = new CreateManagerCommandOutput();
            result.setData(id);

            const handleOption = new HandleOption();
            handleOption.queryRunner = queryRunner;
            await this._createAuthByEmailCommandHandler.handle(auth, handleOption);
            return result;
        });
    }
}
