/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IRequest } from '@shared/request/IRequest';
import { mockDbContext } from '@shared/test/MockDbContext';
import { mockStorageService } from '@shared/test/MockStorageService';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { CreateAuthByEmailHandler } from '@usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { CheckEmailExistHandler } from '@usecases/user/user/check-email-exist/CheckEmailExistHandler';
import { CheckEmailExistOutput } from '@usecases/user/user/check-email-exist/CheckEmailExistOutput';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { RegisterClientHandler } from './RegisterClientHandler';
import { RegisterClientInput } from './RegisterClientInput';

describe('Client usecases - Register client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let authRepository: IAuthRepository;
    let checkEmailExistHandler: CheckEmailExistHandler;
    let registerClientHandler: RegisterClientHandler;
    let param: RegisterClientInput;

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
        Container.set('mail.service', {
            sendUserActivation() {}
        });
        Container.set('storage.service', mockStorageService());

        clientRepository = Container.get<IClientRepository>('client.repository');
        authRepository = Container.get<IAuthRepository>('auth.repository');
        checkEmailExistHandler = Container.get(CheckEmailExistHandler);
        registerClientHandler = Container.get(RegisterClientHandler);
    });

    beforeEach(() => {
        param = new RegisterClientInput();
        param.firstName = 'Client';
        param.lastName = 'Test';
        param.email = 'client.test@localhost.com';
        param.password = 'Nodecore@2';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Register client with email exist error', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = true;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const error: SystemError = await registerClientHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Register client with user authorization exist error', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = false;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        const auth = new Auth();
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const error: SystemError = await registerClientHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Register client', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = false;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        sandbox.stub(clientRepository, 'create').resolves(randomUUID());

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const result = await registerClientHandler.handle(param, usecaseOption);
        expect(result.data).to.eq(true);
    });
});
