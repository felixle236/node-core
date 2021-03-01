import { Inject, Service } from 'typedi';
import { LoginByEmailQuery } from './LoginByEmailQuery';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IAuthJwtService } from '../../../../gateways/services/IAuthJwtService';

@Service()
export class LoginByEmailQueryHandler implements ICommandHandler<LoginByEmailQuery, UserAuthenticated> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('auth_jwt.service')
    private readonly _jwtAuthService: IAuthJwtService;

    async handle(param: LoginByEmailQuery): Promise<UserAuthenticated> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');
        if (!param.password)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'password');

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.comparePassword(param.password) || !auth.user)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'email or password');
        if (auth.user.status !== UserStatus.ACTIVED)
            throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        const token = this._jwtAuthService.sign(auth.userId, auth.user.roleId);
        return new UserAuthenticated(token, auth.userId, auth.user.roleId);
    }
}
