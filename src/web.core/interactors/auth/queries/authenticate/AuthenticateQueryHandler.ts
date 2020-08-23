import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { AuthenticateQuery } from './AuthenticateQuery';
import { IAuthenticationService } from '../../../../gateways/services/IAuthenticationService';
import { IQueryHandler } from '../../../../domain/common/interactor/interfaces/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { UnauthorizedError } from '../../../../domain/common/exceptions/UnauthorizedError';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';

@Service()
export class AuthenticateQueryHandler implements IQueryHandler<AuthenticateQuery, UserAuthenticated> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('authentication.service')
    private readonly _authenticationService: IAuthenticationService;

    async handle(param: AuthenticateQuery): Promise<UserAuthenticated> {
        if (!validator.isJWT(param.token))
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        let payload;
        try {
            payload = this._authenticationService.verify(param.token);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
        }

        if (!payload || !payload.sub || !payload.roleId)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        if (param.roleIds && param.roleIds.length && !param.roleIds.find(roleId => roleId === payload.roleId))
            throw new UnauthorizedError(MessageError.ACCESS_DENIED);

        const roles = await this._roleRepository.getAll();
        const role = roles.find(role => role.id === payload.roleId);
        if (!role)
            throw new UnauthorizedError(MessageError.ACCESS_DENIED);

        return new UserAuthenticated(payload.sub, role);
    }
}
