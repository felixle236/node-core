import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IAuthJwtService } from '@gateways/services/IAuthJwtService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { LoginByEmailInput } from './LoginByEmailInput';
import { LoginByEmailOutput } from './LoginByEmailOutput';

@Service()
export class LoginByEmailHandler extends UsecaseHandler<LoginByEmailInput, LoginByEmailOutput> {
    constructor(
        @Inject('auth.repository') private readonly _authRepository: IAuthRepository,
        @Inject('client.repository') private readonly _clientRepository: IClientRepository,
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository,
        @Inject('auth_jwt.service') private readonly _authJwtService: IAuthJwtService
    ) {
        super();
    }

    async handle(param: LoginByEmailInput): Promise<LoginByEmailOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.comparePassword(param.password) || !auth.user)
            throw new SystemError(MessageError.PARAM_INCORRECT, { t: 'email_or_password' });

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

        const result = new LoginByEmailOutput();
        result.data = this._authJwtService.sign(auth.userId, auth.user.roleId, auth.type);
        return result;
    }
}
