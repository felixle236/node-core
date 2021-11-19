import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Client } from 'domain/entities/user/Client';
import { Manager } from 'domain/entities/user/Manager';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { IMailService } from 'application/interfaces/services/IMailService';
import { expect } from 'chai';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { IRequest } from 'shared/request/IRequest';
import { mockFunction } from 'shared/test/MockFunction';
import { mockInjection, mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ForgotPasswordByEmailHandler } from './ForgotPasswordByEmailHandler';
import { ForgotPasswordByEmailInput } from './ForgotPasswordByEmailInput';

describe('Authorization usecases - Forgot password by email', () => {
    const sandbox = createSandbox();
    let authRepository: IAuthRepository;
    let clientRepository: IClientRepository;
    let managerRepository: IManagerRepository;
    let mailService: IMailService;
    let forgotPasswordByEmailHandler: ForgotPasswordByEmailHandler;
    let clientTest: Client;
    let managerTest: Manager;
    let authTest: Auth;
    let param: ForgotPasswordByEmailInput;

    before(() => {
        authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getByUsername']);
        clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
        managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
        mailService = mockInjection<IMailService>(InjectService.Mail, {
            sendForgotPassword: mockFunction()
        });
        forgotPasswordByEmailHandler = new ForgotPasswordByEmailHandler(authRepository, clientRepository, managerRepository, mailService);
    });

    beforeEach(() => {
        clientTest = new Client();
        clientTest.id = randomUUID();
        clientTest.roleId = RoleId.Client;
        clientTest.firstName = 'client';
        clientTest.lastName = 'test';
        clientTest.status = ClientStatus.Actived;

        managerTest = new Manager();
        managerTest.id = randomUUID();
        managerTest.roleId = RoleId.Manager;
        managerTest.status = ManagerStatus.Actived;

        authTest = new Auth();
        authTest.id = randomUUID();
        authTest.userId = clientTest.id;
        authTest.user = clientTest;

        param = new ForgotPasswordByEmailInput();
        param.email = 'user.test@localhost.com';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Forgot password by email with account authorization is not exist error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves();

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const error: SystemError = await forgotPasswordByEmailHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email with client account is not exist error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'get').resolves();

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const error: SystemError = await forgotPasswordByEmailHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email with client account has not been activated error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        clientTest.status = ClientStatus.Inactived;
        sandbox.stub(clientRepository, 'get').resolves(clientTest);

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const error: SystemError = await forgotPasswordByEmailHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email with manager account is not exist error', async () => {
        authTest = new Auth();
        authTest.id = randomUUID();
        authTest.userId = managerTest.id;
        authTest.user = managerTest;

        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(managerRepository, 'get').resolves();

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const error: SystemError = await forgotPasswordByEmailHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email with manager account has not been activated error', async () => {
        authTest = new Auth();
        authTest.id = randomUUID();
        authTest.userId = managerTest.id;
        authTest.user = managerTest;

        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        managerTest.status = ManagerStatus.Archived;
        sandbox.stub(managerRepository, 'get').resolves(managerTest);

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const error: SystemError = await forgotPasswordByEmailHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'get').resolves(clientTest);
        sandbox.stub(authRepository, 'update').resolves(true);
        sandbox.stub(mailService, 'sendForgotPassword').resolves();

        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const result = await forgotPasswordByEmailHandler.handle(param, usecaseOption);
        expect(result.data).to.eq(true);
    });
});
