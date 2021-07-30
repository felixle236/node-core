/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Auth } from '@domain/entities/auth/Auth';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockDbContext } from '@shared/test/MockDbContext';
import { mockStorageService } from '@shared/test/MockStorageService';
import { CreateAuthByEmailCommandHandler } from '@usecases/auth/auth/commands/create-auth-by-email/CreateAuthByEmailCommandHandler';
import { CheckEmailExistHandler } from '@usecases/user/user/queries/check-email-exist/CheckEmailExistQueryHandler';
import { CheckEmailExistQueryOutput } from '@usecases/user/user/queries/check-email-exist/CheckEmailExistQueryOutput';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { RegisterClientCommandHandler } from './RegisterClientCommandHandler';
import { RegisterClientCommandInput } from './RegisterClientCommandInput';

Container.set(CheckEmailExistHandler, {
    handle() {}
});
Container.set(CreateAuthByEmailCommandHandler, {
    handle() {}
});
Container.set('db.context', mockDbContext);
Container.set('client.repository', {
    create() {}
});
Container.set('auth.repository', {
    getByUsername() {}
});
Container.set('mail.service', {
    sendUserActivation() {}
});
Container.set('storage.service', mockStorageService);

const clientRepository = Container.get<IClientRepository>('client.repository');
const authRepository = Container.get<IAuthRepository>('auth.repository');
const checkEmailExistHandler = Container.get(CheckEmailExistHandler);
const registerClientCommandHandler = Container.get(RegisterClientCommandHandler);

describe('Client - Register client', () => {
    const sandbox = createSandbox();
    let param: RegisterClientCommandInput;

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

    it('Register client with email exist error', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(true);
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);

        const error: SystemError = await registerClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, 'email');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Register client with user authorization exist error', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(false);
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
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
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        sandbox.stub(clientRepository, 'create').resolves(v4());

        const result = await registerClientCommandHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
