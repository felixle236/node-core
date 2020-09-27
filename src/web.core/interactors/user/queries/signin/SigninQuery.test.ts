import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { IJwtAuthService } from '../../../../gateways/services/IJwtAuthService';
import { IRole } from '../../../../domain/types/IRole';
import { IUser } from '../../../../domain/types/IUser';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { RoleId } from '../../../../domain/enums/RoleId';
import { SigninQuery } from './SigninQuery';
import { SigninQueryHandler } from './SigninQueryHandler';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('user.repository', {
    async getByEmailPassword() {}
});
Container.set('jwt.auth.service', {
    sign() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const jwtAuthService = Container.get<IJwtAuthService>('jwt.auth.service');
const signinQueryHandler = Container.get(SigninQueryHandler);

const roleData = { id: RoleId.SUPER_ADMIN, name: 'Role 2' } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, status: UserStatus.ACTIVED, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Signin', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Signin without email', async () => {
        const param = new SigninQuery();

        const result = await signinQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Signin with email is invalid', async () => {
        const param = new SigninQuery();
        param.email = 'test@abc';

        const result = await signinQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Signin with the length of email greater than 120 characters', async () => {
        const param = new SigninQuery();
        param.email = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';

        const result = await signinQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'email', 120));
    });

    it('Signin without password', async () => {
        const param = new SigninQuery();
        param.email = 'test@localhost.com';

        const result = await signinQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'password'));
    });

    it('Signin with the length of password greater than 20 characters', async () => {
        const param = new SigninQuery();
        param.email = 'test@localhost.com';
        param.password = '012345678901234567890';

        const result = await signinQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'password', 20));
    });

    it('Signin with password is not secure', async () => {
        const param = new SigninQuery();
        param.email = 'test@localhost.com';
        param.password = '123abc';

        const result = await signinQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20));
    });

    it('Signin with wrong email or password', async () => {
        sandbox.stub(userRepository, 'getByEmailPassword').resolves(undefined);
        const param = new SigninQuery();
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await signinQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INCORRECT, 'email or password'));
    });

    it('Signin with account is not activated', async () => {
        user.status = UserStatus.INACTIVE;
        sandbox.stub(userRepository, 'getByEmailPassword').resolves(user);
        const param = new SigninQuery();
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await signinQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account'));
    });

    it('Signin successfully', async () => {
        sandbox.stub(userRepository, 'getByEmailPassword').resolves(user);
        sandbox.stub(jwtAuthService, 'sign').returns('token');
        const param = new SigninQuery();
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await signinQueryHandler.handle(param);
        expect(result).to.eq('token');
    });
});
