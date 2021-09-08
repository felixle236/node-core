import { Auth } from '@domain/entities/auth/Auth';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { ResetPasswordByEmailCommandInput } from './ResetPasswordByEmailCommandInput';
import { ResetPasswordByEmailCommandOutput } from './ResetPasswordByEmailCommandOutput';

@Service()
export class ResetPasswordByEmailCommandHandler extends CommandHandler<ResetPasswordByEmailCommandInput, ResetPasswordByEmailCommandOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: ResetPasswordByEmailCommandInput): Promise<ResetPasswordByEmailCommandOutput> {
        await validateDataInput(param);

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account authorization');

        if (auth.forgotKey !== param.forgotKey)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'forgot key');

        if (!auth.forgotExpire || auth.forgotExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, 'forgot key');

        const data = new Auth();
        data.password = param.password;
        data.forgotKey = null;
        data.forgotExpire = null;

        const hasSucceed = await this._authRepository.update(auth.id, data);
        const result = new ResetPasswordByEmailCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
