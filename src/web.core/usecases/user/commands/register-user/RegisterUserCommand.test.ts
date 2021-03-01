import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { RegisterUserCommand } from './RegisterUserCommand';
import { RegisterUserCommandHandler } from './RegisterUserCommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { IRole } from '../../../../domain/types/role/IRole';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { IMailService } from '../../../../gateways/services/IMailService';
import { CreateAuthByEmailCommandHandler } from '../../../auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';

Container.set('user.repository', {
    async getById() {},
    async checkEmailExist() {},
    async create() {}
});
Container.set('mail.service', {
    async sendUserActivation() {}
});
Container.set('auth_jwt.service', {
    sign() {}
});

const userRepository = Container.get<IUserRepository>('user.repository');
const mailService = Container.get<IMailService>('mail.service');
const registerUserCommandHandler = Container.get(RegisterUserCommandHandler);
const createAuthByEmailCommandHandler = Container.get(CreateAuthByEmailCommandHandler);

const roleData = { id: uuid.v4(), name: 'Role 2' } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Register user', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Register user without first name', async () => {
        const param = new RegisterUserCommand();

        const result = await registerUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'first name'));
    });

    it('Register user with the length of first name greater than 20 characters', async () => {
        const param = new RegisterUserCommand();
        param.firstName = 'This is the first name with length greater than 20 characters!';

        const result = await registerUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'first name', 20));
    });

    it('Register user with the length of last name greater than 20 characters', async () => {
        const param = new RegisterUserCommand();
        param.firstName = 'Test';
        param.lastName = 'This is the last name with length greater than 20 characters!';

        const result = await registerUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'last name', 20));
    });

    it('Register user without email', async () => {
        const param = new RegisterUserCommand();
        param.firstName = 'Test';
        param.lastName = '1';

        const result = await registerUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Register user with email is invalid', async () => {
        const param = new RegisterUserCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@abc';

        const result = await registerUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Register user with the length of email greater than 120 characters', async () => {
        const param = new RegisterUserCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';

        const result = await registerUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'email', 120));
    });

    it('Register user with email is existed', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(true);
        const param = new RegisterUserCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await registerUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXISTED, 'email'));
    });

    it('Register user with data cannot save', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(userRepository, 'create').resolves('');
        const param = new RegisterUserCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await registerUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Register user successfully', async () => {
        sandbox.stub(userRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(userRepository, 'create').resolves(user.id);
        sandbox.stub(mailService, 'sendUserActivation').resolves();
        sandbox.stub(createAuthByEmailCommandHandler, 'handle').resolves();
        const param = new RegisterUserCommand();
        param.firstName = 'Test';
        param.lastName = '1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const isSucceed = await registerUserCommandHandler.handle(param);
        expect(isSucceed).to.eq(true);
    });
});
