import * as crypto from 'crypto';
import { Inject, Service } from 'typedi';
import { IAuthenticationService } from '../../../interfaces/services/IAuthenticationService';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IMailService } from '../../../interfaces/services/IMailService';
import { IRoleRepository } from '../../../interfaces/repositories/IRoleRepository';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { RoleId } from '../../../domain/enums/RoleId';
import { SignupInput } from './Input';
import { SignupOutput } from './Output';
import { SystemError } from '../../../domain/common/exceptions';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../domain/enums/UserStatus';
import { addSeconds } from '../../../../libs/date';

@Service()
export class SignupInteractor implements IInteractor<SignupInput, SignupOutput> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('authentication.service')
    private readonly _authenticationService: IAuthenticationService;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: SignupInput): Promise<SignupOutput> {
        const data = new User();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;
        data.password = param.password;

        if (await this._userRepository.checkEmailExist(data.email))
            throw new SystemError(1005, 'email');

        const role = await this._roleRepository.getById(RoleId.COMMON_USER);
        if (!role)
            throw new SystemError(1004, 'role');

        data.roleId = role.id;
        data.status = UserStatus.INACTIVE;
        data.activeKey = crypto.randomBytes(32).toString('hex');
        data.activeExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const id = await this._userRepository.create(data);
        if (!id)
            throw new SystemError(5);

        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(5);

        await this._mailService.sendUserActivation(user);
        const token = this._authenticationService.sign(user);
        return new SignupOutput(token);
    }
}
