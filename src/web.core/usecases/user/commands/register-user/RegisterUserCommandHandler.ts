import * as crypto from 'crypto';
import { Inject, Service } from 'typedi';
import { v4 } from 'uuid';
import { RegisterUserCommand } from './RegisterUserCommand';
import { addSeconds } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { User } from '../../../../domain/entities/user/User';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { IMailService } from '../../../../gateways/services/IMailService';
import { CreateAuthByEmailCommand } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommand';
import { CreateAuthByEmailCommandHandler } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';

@Service()
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand, boolean> {
    @Inject()
    private readonly _createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: RegisterUserCommand): Promise<boolean> {
        const data = new User({ id: v4() } as IUser);
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;

        const auth = new CreateAuthByEmailCommand();
        auth.userId = data.id;
        auth.username = data.email;
        auth.password = param.password;

        const isExist = await this._userRepository.checkEmailExist(data.email);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        data.roleId = RoleId.CLIENT;
        data.status = UserStatus.INACTIVE;
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const id = await this._userRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const name = `${data.firstName} ${data.lastName}`;
        this._mailService.sendUserActivation(name, data.email, data.activeKey);

        await this._createAuthByEmailCommandHandler.handle(auth);
        return true;
    }
}
