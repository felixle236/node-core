/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { GenderType } from '@domain/enums/user/GenderType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockDbContext } from '@shared/test/MockDbContext';
import { mockStorageService } from '@shared/test/MockStorageService';
import { CreateAuthByEmailHandler } from '@usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CheckEmailExistHandler } from '@usecases/user/user/check-email-exist/CheckEmailExistHandler';
import { CheckEmailExistOutput } from '@usecases/user/user/check-email-exist/CheckEmailExistOutput';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { CreateClientHandler } from './CreateClientHandler';
import { CreateClientInput } from './CreateClientInput';

describe('Client usecases - Create client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let authRepository: IAuthRepository;
    let checkEmailExistHandler: CheckEmailExistHandler;
    let createClientHandler: CreateClientHandler;
    let param: CreateClientInput;

    before(() => {
        Container.set(CheckEmailExistHandler, {
            handle() {}
        });
        Container.set(CreateAuthByEmailHandler, {
            handle() {}
        });
        Container.set('db.context', mockDbContext());
        Container.set('client.repository', {
            create() {}
        });
        Container.set('auth.repository', {
            getByUsername() {}
        });
        Container.set('storage.service', mockStorageService());

        clientRepository = Container.get<IClientRepository>('client.repository');
        authRepository = Container.get<IAuthRepository>('auth.repository');
        checkEmailExistHandler = Container.get(CheckEmailExistHandler);
        createClientHandler = Container.get(CreateClientHandler);
    });

    beforeEach(() => {
        param = new CreateClientInput();
        param.firstName = 'Client';
        param.lastName = 'Test';
        param.email = 'client.test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.Female;
        param.birthday = '1970-01-01';
        param.phone = '0123456789';
        param.address = '123 Abc';
        param.locale = 'en-US';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Create client with email exist error', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = true;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);

        const error: SystemError = await createClientHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create client with user authorization exist error', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = false;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        const auth = new Auth();
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);

        const error: SystemError = await createClientHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create client', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = false;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        const id = randomUUID();
        sandbox.stub(clientRepository, 'create').resolves(id);

        const result = await createClientHandler.handle(param);
        expect(result.data).to.eq(id);
    });
});
