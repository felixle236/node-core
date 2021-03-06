import * as crypto from 'crypto';
import { Inject, Service } from 'typedi';
import { ForgotPasswordByEmailCommand } from './ForgotPasswordByEmailCommand';
import { addSeconds } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IMailService } from '../../../../gateways/services/IMailService';

@Service()
export class ForgotPasswordByEmailCommandHandler implements ICommandHandler<ForgotPasswordByEmailCommand, boolean> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async handle(param: ForgotPasswordByEmailCommand): Promise<boolean> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        if (auth.user.status !== UserStatus.ACTIVE)
            throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        const data = new Auth();
        data.forgotKey = crypto.randomBytes(32).toString('hex');
        data.forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const hasSucceed = await this._authRepository.update(auth.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const name = `${auth.user.firstName} ${auth.user.lastName}`;
        this._mailService.sendForgotPassword(name, param.email, data.forgotKey);
        return hasSucceed;
    }
}
