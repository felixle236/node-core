/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
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
import { CreateManagerHandler } from './CreateManagerHandler';
import { CreateManagerInput } from './CreateManagerInput';

describe('Manager usecases - Create manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let authRepository: IAuthRepository;
    let checkEmailExistHandler: CheckEmailExistHandler;
    let createManagerHandler: CreateManagerHandler;
    let param: CreateManagerInput;

    before(() => {
        Container.set(CheckEmailExistHandler, {
            handle() {}
        });
        Container.set(CreateAuthByEmailHandler, {
            handle() {}
        });
        Container.set('db.context', mockDbContext());
        Container.set('manager.repository', {
            create() {}
        });
        Container.set('auth.repository', {
            getByUsername() {}
        });
        Container.set('storage.service', mockStorageService());

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        authRepository = Container.get<IAuthRepository>('auth.repository');
        checkEmailExistHandler = Container.get(CheckEmailExistHandler);
        createManagerHandler = Container.get(CreateManagerHandler);
    });

    beforeEach(() => {
        param = new CreateManagerInput();
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
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = true;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);

        const error: SystemError = await createManagerHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create manager with user authorization exist error', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = false;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        const auth = new Auth();
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);

        const error: SystemError = await createManagerHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXISTED, { t: 'email' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create manager', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = false;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        const id = randomUUID();
        sandbox.stub(managerRepository, 'create').resolves(id);

        const result = await createManagerHandler.handle(param);
        expect(result.data).to.eq(id);
    });
});
