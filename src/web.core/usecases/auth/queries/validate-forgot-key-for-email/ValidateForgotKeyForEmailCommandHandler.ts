import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { ValidateForgotKeyForEmailCommand } from './ValidateForgotKeyForEmailCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { ClientStatus } from '../../../../domain/enums/client/ClientStatus';
import { ManagerStatus } from '../../../../domain/enums/manager/ManagerStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';
import { IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';

@Service()
export class ValidateForgotKeyForEmailCommandHandler implements ICommandHandler<ValidateForgotKeyForEmailCommand, boolean> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: ValidateForgotKeyForEmailCommand): Promise<boolean> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        if (!validator.isEmail(param.email))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        if (!param.forgotKey)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'forgot key');

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.user || auth.forgotKey !== param.forgotKey || !auth.forgotExpire || auth.forgotExpire < new Date())
            return false;

        if (auth.user.roleId === RoleId.CLIENT) {
            const client = await this._clientRepository.getById(auth.userId);
            if (!client || client.status !== ClientStatus.ACTIVED)
                return false;
        }
        else {
            const manager = await this._managerRepository.getById(auth.userId);
            if (!manager || manager.status !== ManagerStatus.ACTIVED)
                return false;
        }
        return true;
    }
}
