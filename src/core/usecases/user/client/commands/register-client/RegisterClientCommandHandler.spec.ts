/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockDbContext } from '@shared/test/MockDbContext';
import { mockStorageService } from '@shared/test/MockStorageService';
import { CreateAuthByEmailCommandHandler } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';
import { CheckEmailExistQueryHandler } from '@usecases/user/user/queries/check-email-exist/CheckEmailExistQueryHandler';
import { CheckEmailExistQueryOutput } from '@usecases/user/user/queries/check-email-exist/CheckEmailExistQueryOutput';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { RegisterClientCommandHandler } from './RegisterClientCommandHandler';
import { RegisterClientCommandInput } from './RegisterClientCommandInput';

describe('Client usecases - Register client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let authRepository: IAuthRepository;
    let checkEmailExistQueryHandler: CheckEmailExistQueryHandler;
    let registerClientCommandHandler;
    let param: RegisterClientCommandInput;

    before(() => {
        Container.set(CheckEmailExistQueryHandler, {
            handle() {}
        });
        Container.set(CreateAuthByEmailCommandHandler, {
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
        checkEmailExistQueryHandler = Container.get(CheckEmailExistQueryHandler);
        registerClientCommandHandler = Container.get(RegisterClientCommandHandler);
    });

    beforeEach(() => {
        param = new RegisterClientCommandInput();
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
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(true);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);

        const error: SystemError = await registerClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, 'email');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Register client with user authorization exist error', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(false);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);
        const auth = new Auth();
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);

        const error: SystemError = await registerClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, 'email');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Register client', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(false);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        sandbox.stub(clientRepository, 'create').resolves(randomUUID());

        const result = await registerClientCommandHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
