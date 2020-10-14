import * as crypto from 'crypto';
import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IJwtAuthService } from '../../../../gateways/services/IJwtAuthService';
import { IMailService } from '../../../../gateways/services/IMailService';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { SignupCommand } from './SignupCommand';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { addSeconds } from '../../../../../libs/date';

@Service()
export class SignupCommandHandler implements ICommandHandler<SignupCommand, string> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('jwt.auth.service')
    private readonly _jwtAuthService: IJwtAuthService;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: SignupCommand): Promise<string> {
        const data = new User();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;
        data.password = param.password;

        const isExist = await this._userRepository.checkEmailExist(data.email);
        if (isExist)
            throw new SystemError(MessageError.PARAM_EXISTED, 'email');

        data.roleId = RoleId.CLIENT;
        data.status = UserStatus.INACTIVE;
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const user = await this._userRepository.createGet(data);
        if (!user)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        this._mailService.sendUserActivation(user);
        return this._jwtAuthService.sign(user);
    }
}
