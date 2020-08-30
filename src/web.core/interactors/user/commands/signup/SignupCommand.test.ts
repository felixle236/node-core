import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { IAuthenticationService } from '../../../../gateways/services/IAuthenticationService';
import { IMailService } from '../../../../gateways/services/IMailService';
import { IRole } from '../../../../domain/types/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { IUser } from '../../../../domain/types/IUser';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SignupCommand } from './SignupCommand';
import { SignupCommandHandler } from './SignupCommandHandler';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('role.repository', {
    async getById() {}
});
Container.set('user.repository', {
    async getById() {},
    async checkEmailExist() {},
    async createGet() {}
});
Container.set('mail.service', {
    async sendUserActivation() {}
});
Container.set('authentication.service', {
    sign() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const userRepository = Container.get<IUserRepository>('user.repository');
const mailService = Container.get<IMailService>('mail.service');
const authenticationService = Container.get<IAuthenticationService>('authentication.service');
const signupCommandHandler = Container.get(SignupCommandHandler);

const roleData = { id: uuid.v4(), name: 'Role 2', level: 2 } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Signup', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Signup without first name', async () => {
        const param = new SignupCommand();

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'first name'));
    });

    it('Signup with the length of first name greater than 20 characters', async () => {
        const param = new SignupCommand();
        param.firstName = 'This is the first name with length greater than 20 characters!';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'first name', 20));
    });

    it('Signup with the length of last name greater than 20 characters', async () => {
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = 'This is the last name with length greater than 20 characters!';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'last name', 20));
    });

    it('Signup without email', async () => {
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Signup with email is invalid', async () => {
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@abc';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Signup with the length of email greater than 120 characters', async () => {
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'email', 120));
    });

    it('Signup without password', async () => {
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'password'));
    });

    it('Signup with the length of password greater than 20 characters', async () => {
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'This is the password with length greater than 20 characters!';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'password', 20));
    });

    it('Signup with password is not secure', async () => {
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = '123456';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20));
    });

    it('Signup with email is existed', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(true);
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXISTED, 'email'));
    });

    it('Signup with role not found', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(roleRepository, 'getById').resolves(undefined);
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_EXISTS, 'role'));
    });

    it('Signup with data cannot save', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(roleRepository, 'getById').resolves(user.role);
        sandbox.stub(userRepository, 'createGet').resolves(undefined);
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await signupCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Signup successfully', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(roleRepository, 'getById').resolves(user.role);
        sandbox.stub(userRepository, 'createGet').resolves(user);
        sandbox.stub(mailService, 'sendUserActivation').resolves();
        sandbox.stub(authenticationService, 'sign').returns('token');
        const param = new SignupCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await signupCommandHandler.handle(param);
        expect(result).to.eq('token');
    });
});
