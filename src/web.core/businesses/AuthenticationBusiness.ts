import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { SystemError, UnauthorizedError } from '../dtos/common/Exception';
import { IAuthenticationBusiness } from '../interfaces/businesses/IAuthenticationBusiness';
import { IAuthenticationService } from '../interfaces/gateways/auth/IAuthenticationService';
import { IMailService } from '../interfaces/gateways/messages/IMailService';
import { IPermissionRepository } from '../interfaces/gateways/data/IPermissionRepository';
import { IRoleRepository } from '../interfaces/gateways/data/IRoleRepository';
import { IUserRepository } from '../interfaces/gateways/data/IUserRepository';
import { RoleId } from '../../constants/Enums';
import { User } from '../models/User';
import { UserAuthenticated } from '../dtos/user/UserAuthenticated';
import { UserResponse } from '../dtos/user/responses/UserResponse';
import { UserSigninRequest } from '../dtos/user/requests/UserSigninRequest';
import { UserSigninSucceedResponse } from '../dtos/user/responses/UserSigninSucceedResponse';
import { UserSignupRequest } from '../dtos/user/requests/UserSignupRequest';
import { mapModel } from '../../libs/common';

@Service('authentication.business')
export class AuthenticationBusiness implements IAuthenticationBusiness {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('permission.repository')
    private readonly _permissionRepository: IPermissionRepository;

    @Inject('authentication.service')
    private readonly _authenticationService: IAuthenticationService

    @Inject('mail.service')
    private readonly _mailService: IMailService;

    async authenticateUser(token: string, claims?: number[]): Promise<UserAuthenticated> {
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

        const userAuth = new UserAuthenticated();
        userAuth.id = Number(payload.sub);
        userAuth.accessToken = token;

        const roles = await this._roleRepository.getAll();
        const role = roles.find(role => role.id === payload.roleId);
        if (!role)
            throw new UnauthorizedError(3);
        userAuth.role = role;

        const permissions = await this._permissionRepository.getAllByRole(payload.roleId);
        userAuth.claims = permissions.map(permission => permission.claim);

        if (!claims || !claims.length)
            return userAuth;

        const permission = userAuth.claims.find(claim => claims.findIndex(c => c === claim) !== -1);
        if (!permission)
            throw new UnauthorizedError(3);
        return userAuth;
    }

    async signin(data: UserSigninRequest): Promise<UserSigninSucceedResponse> {
        const userSignin = new User();
        userSignin.email = data.email;
        userSignin.password = data.password;

        const user = await this._userRepository.getByUserPassword(userSignin.email, userSignin.password);
        if (!user)
            throw new SystemError(1003, 'email address or password');

        if (!user.activedAt)
            throw new SystemError(1009, 'account');

        const accessToken = this._authenticationService.sign(user);
        return new UserSigninSucceedResponse(user, accessToken);
    }

    async signup(data: UserSignupRequest): Promise<UserResponse | undefined> {
        const user = new User();
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.password = data.password;

        if (await this._userRepository.checkEmailExist(user.email))
            throw new SystemError(1005, 'email');

        const role = await this._roleRepository.getById(RoleId.COMMON_USER);
        if (!role)
            throw new SystemError(1004, 'role');

        user.roleId = role.id;
        user.generateActiveKey();

        const id = await this._userRepository.create(user);
        if (!id)
            throw new SystemError(5);

        const newUser = await this._userRepository.getById(id);
        await this._mailService.sendUserActivation(user);
        return mapModel(UserResponse, newUser);
    }

    async active(activeKey: string): Promise<boolean> {
        if (!activeKey)
            throw new SystemError();

        const user = await this._userRepository.getByActiveKey(activeKey);
        if (!user)
            throw new SystemError(1004, 'activation key');
        if (user.activedAt)
            throw new SystemError();
        if (!user.activeKey || !user.activeExpire || user.activeExpire < new Date())
            throw new SystemError(1008, 'activation key');

        user.activeKey = undefined;
        user.activeExpire = undefined;
        user.activedAt = new Date();
        return await this._userRepository.update(user.id, user);
    }

    async resendActivation(email: string): Promise<boolean> {
        if (!validator.isEmail(email))
            throw new SystemError(1002, 'email');

        const user = await this._userRepository.getByEmail(email);
        if (!user || user.activedAt)
            throw new SystemError();

        user.generateActiveKey();
        const hasSucceed = await this._userRepository.update(user.id, user);
        await this._mailService.resendUserActivation(user);
        return hasSucceed;
    }

    async forgotPassword(email: string): Promise<boolean> {
        if (!validator.isEmail(email))
            throw new SystemError(1002, 'email');

        const user = await this._userRepository.getByEmail(email);
        if (!user || !user.activedAt)
            throw new SystemError();

        user.generateForgotKey();
        const hasSucceed = await this._userRepository.update(user.id, user);
        await this._mailService.sendForgotPassword(user);
        return hasSucceed;
    }

    async resetPassword(forgotKey: string, password: string): Promise<boolean> {
        if (!forgotKey || !password)
            throw new SystemError();

        const user = await this._userRepository.getByForgotKey(forgotKey);
        if (!user)
            throw new SystemError(1004, 'forgot key');
        if (!user.activedAt)
            throw new SystemError();
        if (!user.forgotKey || !user.forgotExpire || user.forgotExpire < new Date())
            throw new SystemError(1008, 'forgot key');

        user.password = password;
        user.forgotKey = undefined;
        user.forgotExpire = undefined;
        return await this._userRepository.update(user.id, user);
    }
}
