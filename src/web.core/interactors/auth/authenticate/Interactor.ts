import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { AuthenticateInput } from './Input';
import { IAuthenticationService } from '../../../gateways/services/IAuthenticationService';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { UnauthorizedError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class AuthenticateInteractor implements IInteractor<AuthenticateInput, UserAuthenticated> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('authentication.service')
    private readonly _authenticationService: IAuthenticationService;

    async handle(param: AuthenticateInput): Promise<UserAuthenticated> {
        const parts = (param.token || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : (parts.length === 1 ? parts[0] : '');
        const roleIds = param.roleIds;

        if (!validator.isJWT(token))
            throw new UnauthorizedError(1010, 'authorization token');

        let payload;
        try {
            payload = this._authenticationService.verify(token);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(1008, 'token');
        }

        if (!payload || !payload.sub || !payload.roleId)
            throw new UnauthorizedError(1002, 'token');

        if (roleIds && roleIds.length && !roleIds.find(roleId => roleId === payload.roleId))
            throw new UnauthorizedError(3);

        const userAuth = new UserAuthenticated();
        userAuth.userId = Number(payload.sub);

        const roles = await this._roleRepository.getAll();
        const role = roles.find(role => role.id === payload.roleId);
        if (!role)
            throw new UnauthorizedError(3);

        userAuth.role = role;
        return userAuth;
    }
}
