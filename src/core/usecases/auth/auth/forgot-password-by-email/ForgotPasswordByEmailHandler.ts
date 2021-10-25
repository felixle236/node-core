import crypto from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IMailService } from '@gateways/services/IMailService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { addSeconds } from '@utils/datetime';
import { Inject, Service } from 'typedi';
import { ForgotPasswordByEmailInput } from './ForgotPasswordByEmailInput';
import { ForgotPasswordByEmailOutput } from './ForgotPasswordByEmailOutput';

@Service()
export class ForgotPasswordByEmailHandler extends UsecaseHandler<ForgotPasswordByEmailInput, ForgotPasswordByEmailOutput> {
    constructor(
        @Inject('auth.repository') private readonly _authRepository: IAuthRepository,
        @Inject('client.repository') private readonly _clientRepository: IClientRepository,
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository,
        @Inject('mail.service') private readonly _mailService: IMailService
    ) {
        super();
    }

    async handle(param: ForgotPasswordByEmailInput, usecaseOption: UsecaseOption): Promise<ForgotPasswordByEmailOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

        if (auth.user.roleId === RoleId.Client) {
            const client = await this._clientRepository.get(auth.userId);
            if (!client)
                throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });
            if (client.status !== ClientStatus.Actived)
                throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });
        }
        else {
            const manager = await this._managerRepository.get(auth.userId);
            if (!manager)
                throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });
            if (manager.status !== ManagerStatus.Actived)
                throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });
        }

        const data = new Auth();
        data.forgotKey = crypto.randomBytes(32).toString('hex');
        data.forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60);

        const result = new ForgotPasswordByEmailOutput();
        result.data = await this._authRepository.update(auth.id, data);

        const name = `${auth.user.firstName} ${auth.user.lastName}`;
        this._mailService.sendForgotPassword(name, param.email, data.forgotKey, usecaseOption.req.locale);

        return result;
    }
}
