import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { AuthenticateUserQuery } from './AuthenticateUserQuery';
import { IAuthenticationService } from '../../../../gateways/services/IAuthenticationService';
import { IQueryHandler } from '../../../../domain/common/interactor/interfaces/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { UnauthorizedError } from '../../../../domain/common/exceptions/UnauthorizedError';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';

@Service()
export class AuthenticateUserQueryHandler implements IQueryHandler<AuthenticateUserQuery, UserAuthenticated> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('authentication.service')
    private readonly _authenticationService: IAuthenticationService;

    async handle(param: AuthenticateUserQuery): Promise<UserAuthenticated> {
        if (!param.token)
            throw new UnauthorizedError(MessageError.PARAM_REQUIRED, 'token');

        if (!validator.isJWT(param.token))
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        let payload;
        try {
            payload = this._authenticationService.verify(param.token);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
            else
                throw new UnauthorizedError(MessageError.SOMETHING_WRONG);
        }

        if (!payload || !payload.sub || !payload.roleId)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        if (param.roleIds && param.roleIds.length && !param.roleIds.find(roleId => roleId === payload.roleId))
            throw new UnauthorizedError(MessageError.ACCESS_DENIED);

        const roles = await this._roleRepository.getAll();
        const role = roles.find(role => role.id === payload.roleId);
        if (!role)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'role');

        return new UserAuthenticated(payload.sub, role);
    }
}
