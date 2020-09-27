import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IJwtAuthService } from '../../../../gateways/services/IJwtAuthService';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SigninQuery } from './SigninQuery';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';

@Service()
export class SigninQueryHandler implements ICommandHandler<SigninQuery, string> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('jwt.auth.service')
    private readonly _jwtAuthService: IJwtAuthService;

    async handle(param: SigninQuery): Promise<string> {
        const data = new User();
        data.email = param.email;
        data.password = param.password;

        const user = await this._userRepository.getByEmailPassword(data.email, data.password);
        if (!user)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'email or password');

        if (user.status !== UserStatus.ACTIVED)
            throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        return this._jwtAuthService.sign(user);
    }
}
