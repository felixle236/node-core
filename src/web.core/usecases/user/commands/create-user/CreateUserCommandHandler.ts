import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { CreateUserCommand } from './CreateUserCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IUser } from '../../../../domain/types/user/IUser';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { CreateAuthByEmailCommand } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommand';
import { CreateAuthByEmailCommandHandler } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';

@Service()
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, string> {
    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: CreateUserCommand): Promise<string> {
        const data = new User({ id: v4() } as IUser);
        data.roleId = param.roleId;
        data.status = UserStatus.ACTIVED;
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

        const isExist = await this._userRepository.checkEmailExist(data.email);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        const role = await this._roleRepository.getById(data.roleId);
        if (!role)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'role');

        const id = await this._userRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        await this._createAuthByEmailCommandHandler.handle(auth);
        return id;
    }
}
