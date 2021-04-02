import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { CreateClientCommand } from './CreateClientCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Client } from '../../../../domain/entities/client/Client';
import { ClientStatus } from '../../../../domain/enums/client/ClientStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IClient } from '../../../../domain/types/client/IClient';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { CreateAuthByEmailCommand } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommand';
import { CreateAuthByEmailCommandHandler } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';

@Service()
export class CreateClientCommandHandler implements ICommandHandler<CreateClientCommand, string> {
    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: CreateClientCommand): Promise<string> {
        if (param.roleAuthId !== RoleId.SUPER_ADMIN)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const data = new Client({ id: v4() } as IClient);
        data.roleId = RoleId.CLIENT;
        data.status = ClientStatus.ACTIVED;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;
        data.gender = param.gender;
        data.birthday = param.birthday;
        data.phone = param.phone;
        data.address = param.address;
        data.culture = param.culture;
        data.currency = param.currency;

        const auth = new CreateAuthByEmailCommand();
        auth.userId = data.id;
        auth.email = data.email;
        auth.password = param.password;

        const isExistEmail = await this._clientRepository.checkEmailExist(data.email);
        if (isExistEmail)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const isExistUsername = await this._authRepository.getByUsername(data.email);
        if (isExistUsername)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const role = await this._roleRepository.getById(data.roleId);
        if (!role)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'role');

        const id = await this._clientRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._createAuthByEmailCommandHandler.handle(auth);
        return id;
    }
}
