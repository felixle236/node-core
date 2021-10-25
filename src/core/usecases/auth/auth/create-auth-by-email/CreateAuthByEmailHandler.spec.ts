/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { Client } from '@domain/entities/user/Client';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockQueryRunner } from '@shared/test/MockTypeORM';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { CreateAuthByEmailHandler } from './CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from './CreateAuthByEmailInput';

describe('Authorization usecases - Create authorization by email', () => {
    const sandbox = createSandbox();
    let userRepository: IUserRepository;
    let authRepository: IAuthRepository;
    let createAuthByEmailHandler: CreateAuthByEmailHandler;
    let clientTest: Client;
    let authTests: Auth[];
    let param: CreateAuthByEmailInput;

    before(() => {
        Container.set('user.repository', {
            get() {}
        });
        Container.set('auth.repository', {
            getAllByUser() {},
            create() {}
        });

        userRepository = Container.get<IUserRepository>('user.repository');
        authRepository = Container.get<IAuthRepository>('auth.repository');
        createAuthByEmailHandler = Container.get(CreateAuthByEmailHandler);
    });

    beforeEach(() => {
        clientTest = new Client();
        const auth = new Auth();
        auth.type = AuthType.PersonalEmail;
        authTests = [auth];

        param = new CreateAuthByEmailInput();
        param.userId = randomUUID();
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
        const { queryRunner } = mockQueryRunner(sandbox);
        sandbox.stub(userRepository, 'get').resolves(null);

        const usecaseOption = new UsecaseOption();
        usecaseOption.queryRunner = queryRunner;
        const error: SystemError = await createAuthByEmailHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'user' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create authorization by email with data is already existed error', async () => {
        const { queryRunner } = mockQueryRunner(sandbox);
        sandbox.stub(userRepository, 'get').resolves(clientTest);
        sandbox.stub(authRepository, 'getAllByUser').resolves(authTests);

        const usecaseOption = new UsecaseOption();
        usecaseOption.queryRunner = queryRunner;
        const error: SystemError = await createAuthByEmailHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, { t: 'data' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create authorization by email', async () => {
        const { queryRunner } = mockQueryRunner(sandbox);
        sandbox.stub(userRepository, 'get').resolves(clientTest);
        sandbox.stub(authRepository, 'getAllByUser').resolves([]);
        const id = randomUUID();
        sandbox.stub(authRepository, 'create').resolves(id);

        const usecaseOption = new UsecaseOption();
        usecaseOption.queryRunner = queryRunner;
        const result = await createAuthByEmailHandler.handle(param, usecaseOption);
        expect(result.data).to.eq(id);
    });
});
