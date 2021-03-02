import { Inject, Service } from 'typedi';
import { LoginByEmailQuery } from './LoginByEmailQuery';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';
import { ClientStatus } from '../../../../domain/enums/client/ClientStatus';
import { ManagerStatus } from '../../../../domain/enums/manager/ManagerStatus';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '../../../../gateways/repositories/client/IClientRepository';
import { IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';
import { IAuthJwtService } from '../../../../gateways/services/IAuthJwtService';

@Service()
export class LoginByEmailQueryHandler implements ICommandHandler<LoginByEmailQuery, UserAuthenticated> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    @Inject('auth_jwt.service')
    private readonly _jwtAuthService: IAuthJwtService;

    async handle(param: LoginByEmailQuery): Promise<UserAuthenticated> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');
        if (!param.password)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'password');

        const auth = await this._authRepository.getByUsername(param.email);
        if (!auth || !auth.comparePassword(param.password) || !auth.user)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'email or password');

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

        const token = this._jwtAuthService.sign(auth.userId, auth.user.roleId);
        return new UserAuthenticated(token, auth.userId, auth.user.roleId);
    }
}
