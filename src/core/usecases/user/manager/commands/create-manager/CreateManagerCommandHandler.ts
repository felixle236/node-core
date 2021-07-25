import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IManager } from '@domain/interfaces/user/IManager';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { validateDataInput } from '@libs/common';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { CreateAuthByEmailCommandHandler } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';
import { CreateAuthByEmailCommandInput } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandInput';
import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { CreateManagerCommandInput } from './CreateManagerCommandInput';
import { CreateManagerCommandOutput } from './CreateManagerCommandOutput';

@Service()
export class CreateManagerCommandHandler extends CommandHandler<CreateManagerCommandInput, CreateManagerCommandOutput> {
    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: CreateManagerCommandInput): Promise<CreateManagerCommandOutput> {
        await validateDataInput(param);

        const data = new Manager({ id: v4() } as IManager);
        data.roleId = RoleId.MANAGER;
        data.status = ManagerStatus.ACTIVED;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const auth = new CreateAuthByEmailCommandInput();
        auth.userId = data.id;
        auth.email = data.email;
        auth.password = param.password;

        const isExistEmail = await this._managerRepository.checkEmailExist(data.email);
        if (isExistEmail)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const id = await this._managerRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._createAuthByEmailCommandHandler.handle(auth);
        const result = new CreateManagerCommandOutput();
        result.setData(id);
        return result;
    }
}
