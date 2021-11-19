import { Auth } from 'domain/entities/auth/Auth';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { LoginByEmailInput } from './LoginByEmailInput';
import { LoginByEmailOutput } from './LoginByEmailOutput';

@Service()
export class LoginByEmailHandler implements IUsecaseHandler<LoginByEmailInput, LoginByEmailOutput> {
    constructor(
        @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
        @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository,
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository,
        @Inject(InjectService.AuthJwt) private readonly _authJwtService: IAuthJwtService
    ) {}

    async handle(param: LoginByEmailInput): Promise<LoginByEmailOutput> {
        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || Auth.hashPassword(param.password) !== auth.password || !auth.user)
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
