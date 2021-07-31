/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Auth } from '@domain/entities/auth/Auth';
import { GenderType } from '@domain/enums/user/GenderType';
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
import { v4 } from 'uuid';
import { CreateClientCommandHandler } from './CreateClientCommandHandler';
import { CreateClientCommandInput } from './CreateClientCommandInput';

describe('Client - Create client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let authRepository: IAuthRepository;
    let checkEmailExistQueryHandler: CheckEmailExistQueryHandler;
    let createClientCommandHandler: CreateClientCommandHandler;
    let param: CreateClientCommandInput;

    before(() => {
        Container.set(CheckEmailExistQueryHandler, {
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
        Container.set('storage.service', mockStorageService);

        clientRepository = Container.get<IClientRepository>('client.repository');
        authRepository = Container.get<IAuthRepository>('auth.repository');
        checkEmailExistQueryHandler = Container.get(CheckEmailExistQueryHandler);
        createClientCommandHandler = Container.get(CreateClientCommandHandler);
    });

    beforeEach(() => {
        param = new CreateClientCommandInput();
        param.firstName = 'Client';
        param.lastName = 'Test';
        param.email = 'client.test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.FEMALE;
        param.birthday = '2000-06-08';
        param.phone = '0123456789';
        param.address = '123 Abc';
        param.locale = 'vi-VN';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Create client with email exist error', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(true);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);

        const error: SystemError = await createClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, 'email');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create client with user authorization exist error', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(false);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);
        const auth = new Auth();
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);

        const error: SystemError = await createClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, 'email');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create client', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(false);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        const id = v4();
        sandbox.stub(clientRepository, 'create').resolves(id);

        const result = await createClientCommandHandler.handle(param);
        expect(result.data).to.eq(id);
    });
});
