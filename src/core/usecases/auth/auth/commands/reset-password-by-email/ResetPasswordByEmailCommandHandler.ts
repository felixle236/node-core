import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { validateDataInput } from '@libs/common';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { ResetPasswordByEmailCommandInput } from './ResetPasswordByEmailCommandInput';
import { ResetPasswordByEmailCommandOutput } from './ResetPasswordByEmailCommandOutput';
import { Auth } from '../../../../../domain/entities/auth/Auth';

@Service()
export class ResetPasswordByEmailCommandHandler extends CommandHandler<ResetPasswordByEmailCommandInput, ResetPasswordByEmailCommandOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: ResetPasswordByEmailCommandInput): Promise<ResetPasswordByEmailCommandOutput> {
        await validateDataInput(param);

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        if (auth.user.roleId === RoleId.CLIENT) {
            const client = await this._clientRepository.getById(auth.userId);
            if (!client)
                throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');
            if (client.status !== ClientStatus.ACTIVED)
                throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');
        }
        else {
            const manager = await this._managerRepository.getById(auth.userId);
            if (!manager)
                throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');
            if (manager.status !== ManagerStatus.ACTIVED)
                throw new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');
        }

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

        const result = new ResetPasswordByEmailCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
