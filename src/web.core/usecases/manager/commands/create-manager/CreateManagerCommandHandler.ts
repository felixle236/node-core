import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { CreateManagerCommand } from './CreateManagerCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Manager } from '../../../../domain/entities/manager/Manager';
import { ManagerStatus } from '../../../../domain/enums/manager/ManagerStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IManager } from '../../../../domain/types/manager/IManager';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { CreateAuthByEmailCommand } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommand';
import { CreateAuthByEmailCommandHandler } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';

@Service()
export class CreateManagerCommandHandler implements ICommandHandler<CreateManagerCommand, string> {
    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: CreateManagerCommand): Promise<string> {
        if (param.roleAuthId !== RoleId.SUPER_ADMIN)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const data = new Manager({ id: v4() } as IManager);
        data.roleId = RoleId.MANAGER;
        data.status = ManagerStatus.ACTIVED;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const auth = new CreateAuthByEmailCommand();
        auth.userId = data.id;
        auth.username = data.email;
        auth.password = param.password;

        const isExistEmail = await this._managerRepository.checkEmailExist(data.email);
        if (isExistEmail)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const role = await this._roleRepository.getById(data.roleId);
        if (!role)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'role');

        const id = await this._managerRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._createAuthByEmailCommandHandler.handle(auth);
        return id;
    }
}
