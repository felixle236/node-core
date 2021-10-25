import { Auth } from '@domain/entities/auth/Auth';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { ResetPasswordByEmailInput } from './ResetPasswordByEmailInput';
import { ResetPasswordByEmailOutput } from './ResetPasswordByEmailOutput';

@Service()
export class ResetPasswordByEmailHandler extends UsecaseHandler<ResetPasswordByEmailInput, ResetPasswordByEmailOutput> {
    constructor(
        @Inject('auth.repository') private readonly _authRepository: IAuthRepository
    ) {
        super();
    }

    async handle(param: ResetPasswordByEmailInput): Promise<ResetPasswordByEmailOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

        if (auth.forgotKey !== param.forgotKey)
            throw new SystemError(MessageError.PARAM_INCORRECT, { t: 'forgot_key' });

        if (!auth.forgotExpire || auth.forgotExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, { t: 'forgot_key' });

        const data = new Auth();
        data.password = param.password;
        data.forgotKey = null;
        data.forgotExpire = null;

        const result = new ResetPasswordByEmailOutput();
        result.data = await this._authRepository.update(auth.id, data);
        return result;
    }
}
