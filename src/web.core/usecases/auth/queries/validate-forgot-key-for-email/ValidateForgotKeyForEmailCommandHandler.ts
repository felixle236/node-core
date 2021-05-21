import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { ValidateForgotKeyForEmailCommand } from './ValidateForgotKeyForEmailCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';

@Service()
export class ValidateForgotKeyForEmailCommandHandler implements ICommandHandler<ValidateForgotKeyForEmailCommand, boolean> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: ValidateForgotKeyForEmailCommand): Promise<boolean> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        if (!validator.isEmail(param.email))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        if (!param.forgotKey)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'forgot key');

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user || auth.user.status !== UserStatus.ACTIVE || auth.forgotKey !== param.forgotKey || !auth.forgotExpire || auth.forgotExpire < new Date())
            return false;
        return true;
    }
}
