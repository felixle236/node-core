/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Auth } from '@domain/entities/auth/Auth';
import { Client } from '@domain/entities/user/Client';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { CreateAuthByEmailCommandHandler } from './CreateAuthByEmailCommandHandler';
import { CreateAuthByEmailCommandInput } from './CreateAuthByEmailCommandInput';

describe('Authorization usecases - Create authorization by email', () => {
    const sandbox = createSandbox();
    let userRepository: IUserRepository;
    let authRepository: IAuthRepository;
    let createAuthByEmailCommandHandler: CreateAuthByEmailCommandHandler;
    let clientTest: Client;
    let authTests: Auth[];
    let param: CreateAuthByEmailCommandInput;

    before(() => {
        Container.set('user.repository', {
            getById() {}
        });
        Container.set('auth.repository', {
            getAllByUser() {},
            create() {}
        });

        userRepository = Container.get<IUserRepository>('user.repository');
        authRepository = Container.get<IAuthRepository>('auth.repository');
        createAuthByEmailCommandHandler = Container.get(CreateAuthByEmailCommandHandler);
    });

    beforeEach(() => {
        clientTest = new Client();
        const auth = new Auth();
        auth.type = AuthType.PERSONAL_EMAIL;
        authTests = [auth];

        param = new CreateAuthByEmailCommandInput();
        param.userId = v4();
        param.email = 'user.test@localhost.com';
        param.password = 'Nodecore@2';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Create authorization by email with user is not exist error', async () => {
        sandbox.stub(userRepository, 'getById').resolves(null);

        const error: SystemError = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'user');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create authorization by email with data is already existed error', async () => {
        sandbox.stub(userRepository, 'getById').resolves(clientTest);
        sandbox.stub(authRepository, 'getAllByUser').resolves(authTests);

        const error: SystemError = await createAuthByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, 'data');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create authorization by email', async () => {
        sandbox.stub(userRepository, 'getById').resolves(clientTest);
        sandbox.stub(authRepository, 'getAllByUser').resolves([]);
        const id = v4();
        sandbox.stub(authRepository, 'create').resolves(id);

        const result = await createAuthByEmailCommandHandler.handle(param);
        expect(result).to.eq(id);
    });
});
