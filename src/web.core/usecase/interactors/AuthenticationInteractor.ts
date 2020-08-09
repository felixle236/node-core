import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { IAuthenticationInteractor } from '../boundaries/interactors/IAuthenticationInteractor';
import { IAuthenticationService } from '../boundaries/services/IAuthenticationService';
import { IRoleRepository } from '../boundaries/data/IRoleRepository';
import { IUserRepository } from '../boundaries/data/IUserRepository';
import { SystemError } from '../../dtos/common/Exception';
import { UnauthorizedError } from '../../domain/common/exceptions';
import { User } from '../../domain/entities/User';
import { UserAuthenticated } from '../../dtos/common/UserAuthenticated';
import { UserStatus } from '../../domain/enums/UserStatus';

@Service('authentication.interactor')
export class AuthenticationInteractor implements IAuthenticationInteractor {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('authentication.service')
    private readonly _authenticationService: IAuthenticationService;

    async authenticateUser(token: string, roleIds?: number[]): Promise<UserAuthenticated> {
        const parts = (token || '').split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer')
            token = parts[1];

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
        userAuth.accessToken = token;

        const roles = await this._roleRepository.getAll();
        const role = roles.find(role => role.id === payload.roleId);
        if (!role)
            throw new UnauthorizedError(3);
        userAuth.role = role;
        return userAuth;
    }

    async login(data: UserLoginRequest): Promise<UserLoginSucceedResponse> {
        const userLogin = new User();
        userLogin.email = data.email;
        userLogin.password = data.password;

        const user = await this._userRepository.getByUserPassword(userLogin.email, userLogin.password);
        if (!user)
            throw new SystemError(1003, 'email address or password');

        if (user.status !== UserStatus.ACTIVED)
            throw new SystemError(1009, 'account');

        const accessToken = this._authenticationService.sign(user);
        return new UserLoginSucceedResponse(user, accessToken);
    }
}
