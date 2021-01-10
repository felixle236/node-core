import { Inject, Service } from 'typedi';
import { SigninQuery } from './SigninQuery';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { IJwtAuthService } from '../../../../gateways/services/IJwtAuthService';

@Service()
export class SigninQueryHandler implements ICommandHandler<SigninQuery, UserAuthenticated> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('jwt.auth.service')
    private readonly _jwtAuthService: IJwtAuthService;

    async handle(param: SigninQuery): Promise<UserAuthenticated> {
        const data = new User();
        data.email = param.email;
        data.password = param.password;

        const user = await this._userRepository.getByEmailPassword(data.email, data.password);
        if (!user)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'email or password');

        if (user.status !== UserStatus.ACTIVED)
            throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        const token = this._jwtAuthService.sign(user);
        return new UserAuthenticated(token, user.id, user.roleId);
    }
}
