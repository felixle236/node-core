import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { CreateAuthByEmailCommand } from './CreateAuthByEmailCommand';
import { CreateAuthByEmailCommandHandler } from './CreateAuthByEmailCommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { User } from '../../../../domain/entities/user/User';
import { AuthType } from '../../../../domain/enums/auth/AuthType';
import { IAuth } from '../../../../domain/types/auth/IAuth';
import { IUser } from '../../../../domain/types/user/IUser';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

Container.set('user.repository', {
    async getById() {}
});
Container.set('auth.repository', {
    async getAllByUser() {},
    async create() {}
});

const userRepository = Container.get<IUserRepository>('user.repository');
const authRepository = Container.get<IAuthRepository>('auth.repository');
const createAuthByEmailCommandHandler = Container.get(CreateAuthByEmailCommandHandler);

const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: uuid.v4(), firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};
const generateAuth = (user: User) => {
    return new Auth({ id: uuid.v4(), createdAt: new Date(), userId: user.id, user: user.toData(), type: AuthType.PERSONAL_EMAIL, username: user.email } as IAuth);
};

describe('Authentication - Create authentication by email', () => {
    const sandbox = createSandbox();
    let user: User;
    let auth: Auth;

    beforeEach(() => {
        user = generateUser();
        auth = generateAuth(user);
        auth.password = 'Nodecore@123';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Create authentication by email without user id', async () => {
        const param = new CreateAuthByEmailCommand();

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'user'));
    });

    it('Create authentication by email without username', async () => {
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'username'));
    });

    it('Create authentication by email with the length of username less than 6 characters', async () => {
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = 'test';

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_GREATER_OR_EQUAL, 'username', 6));
    });

    it('Create authentication by email with the length of username greater than 120 characters', async () => {
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'username', 120));
    });

    it('Create authentication by email without password', async () => {
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = auth.username;

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'password'));
    });

    it('Create authentication by email with the length of password greater than 20 characters', async () => {
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = auth.username;
        param.password = 'This is the password with length greater than 20 characters!';

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'password', 20));
    });

    it('Create authentication by email with password is not secure', async () => {
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = auth.username;
        param.password = '123456';

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20));
    });

    it('Create authentication by email with user not exist', async () => {
        sandbox.stub(userRepository, 'getById').resolves(null);
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = auth.username;
        param.password = 'Nodecore@123';

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_EXISTS, 'user'));
    });

    it('Create authentication by email with data has exist', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(authRepository, 'getAllByUser').resolves([auth]);
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = auth.username;
        param.password = 'Nodecore@123';

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXISTED, 'data'));
    });

    it('Create authentication by email with data cannot save', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(authRepository, 'getAllByUser').resolves([]);
        sandbox.stub(authRepository, 'create').resolves('');
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = auth.username;
        param.password = 'Nodecore@123';

        const result = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Create authentication by email successfully', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(authRepository, 'getAllByUser').resolves([]);
        sandbox.stub(authRepository, 'create').resolves(auth.id);
        const param = new CreateAuthByEmailCommand();
        param.userId = auth.userId;
        param.username = auth.username;
        param.password = 'Nodecore@123';

        const id = await createAuthByEmailCommandHandler.handle(param);
        expect(id).to.eq(auth.id);
    });
});
