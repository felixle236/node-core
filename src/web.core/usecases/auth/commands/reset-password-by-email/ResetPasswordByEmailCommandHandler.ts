import { Inject, Service } from 'typedi';
import { ResetPasswordByEmailCommand } from './ResetPasswordByEmailCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';

@Service()
export class ResetPasswordByEmailCommandHandler implements ICommandHandler<ResetPasswordByEmailCommand, boolean> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: ResetPasswordByEmailCommand): Promise<boolean> {
        if (!param.forgotKey)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'forgot key');
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');
        if (!param.password)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'password');

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        if (auth.user.status !== UserStatus.ACTIVED)
            throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        if (auth.forgotKey !== param.forgotKey)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'forgot key');

        if (!auth.forgotExpire || auth.forgotExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, 'forgot key');

        const data = new Auth();
        data.password = param.password;
        data.forgotKey = null;
        data.forgotExpire = null;

        const hasSucceed = await this._authRepository.update(auth.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
