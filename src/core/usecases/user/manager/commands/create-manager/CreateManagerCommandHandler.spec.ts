/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Auth } from '@domain/entities/auth/Auth';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
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
import { CreateManagerCommandHandler } from './CreateManagerCommandHandler';
import { CreateManagerCommandInput } from './CreateManagerCommandInput';

describe('Manager - Create manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let authRepository: IAuthRepository;
    let checkEmailExistQueryHandler: CheckEmailExistQueryHandler;
    let createManagerCommandHandler: CreateManagerCommandHandler;
    let param: CreateManagerCommandInput;

    before(() => {
        Container.set(CheckEmailExistQueryHandler, {
            handle() {}
        });
        Container.set(CreateAuthByEmailCommandHandler, {
            handle() {}
        });
        Container.set('db.context', mockDbContext);
        Container.set('manager.repository', {
            create() {}
        });
        Container.set('auth.repository', {
            getByUsername() {}
        });
        Container.set('storage.service', mockStorageService);

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        authRepository = Container.get<IAuthRepository>('auth.repository');
        checkEmailExistQueryHandler = Container.get(CheckEmailExistQueryHandler);
        createManagerCommandHandler = Container.get(CreateManagerCommandHandler);
    });

    beforeEach(() => {
        param = new CreateManagerCommandInput();
        param.firstName = 'Manager';
        param.lastName = 'Test';
        param.email = 'manager.test@localhost.com';
        param.password = 'Nodecore@2';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Create manager with email exist error', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(true);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);

        const error: SystemError = await createManagerCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, 'email');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create manager with user authorization exist error', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(false);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);
        const auth = new Auth();
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);

        const error: SystemError = await createManagerCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, 'email');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create manager', async () => {
        const checkEmailResult = new CheckEmailExistQueryOutput();
        checkEmailResult.setData(false);
        sandbox.stub(checkEmailExistQueryHandler, 'handle').resolves(checkEmailResult);
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        const id = v4();
        sandbox.stub(managerRepository, 'create').resolves(id);

        const result = await createManagerCommandHandler.handle(param);
        expect(result.data).to.eq(id);
    });
});
