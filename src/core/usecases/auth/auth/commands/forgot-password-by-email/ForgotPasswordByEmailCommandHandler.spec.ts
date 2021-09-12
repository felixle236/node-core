/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { Client } from '@domain/entities/user/Client';
import { Manager } from '@domain/entities/user/Manager';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IClient } from '@domain/interfaces/user/IClient';
import { IManager } from '@domain/interfaces/user/IManager';
import { IUser } from '@domain/interfaces/user/IUser';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { IMailService } from '@gateways/services/IMailService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ForgotPasswordByEmailCommandHandler } from './ForgotPasswordByEmailCommandHandler';
import { ForgotPasswordByEmailCommandInput } from './ForgotPasswordByEmailCommandInput';

describe('Authorization usecases - Forgot password by email', () => {
    const sandbox = createSandbox();
    let authRepository: IAuthRepository;
    let clientRepository: IClientRepository;
    let managerRepository: IManagerRepository;
    let mailService: IMailService;
    let forgotPasswordByEmailCommandHandler: ForgotPasswordByEmailCommandHandler;
    let clientTest: Client;
    let managerTest: Manager;
    let authTest: Auth;
    let param: ForgotPasswordByEmailCommandInput;

    before(() => {
        Container.set('auth.repository', {
            getByUsername() {},
            update() {}
        });
        Container.set('client.repository', {
            getById() {}
        });
        Container.set('manager.repository', {
            getById() {}
        });
        Container.set('mail.service', {
            sendForgotPassword() {}
        });

        authRepository = Container.get<IAuthRepository>('auth.repository');
        clientRepository = Container.get<IClientRepository>('client.repository');
        managerRepository = Container.get<IManagerRepository>('manager.repository');
        mailService = Container.get<IMailService>('mail.service');
        forgotPasswordByEmailCommandHandler = Container.get(ForgotPasswordByEmailCommandHandler);
    });

    beforeEach(() => {
        clientTest = new Client({
            id: randomUUID(),
            roleId: RoleId.Client,
            firstName: 'client',
            lastName: 'test',
            status: ClientStatus.Actived
        } as IClient);
        managerTest = new Manager({
            id: randomUUID(),
            roleId: RoleId.Manager,
            status: ManagerStatus.Actived
        } as IManager);
        authTest = new Auth({
            id: randomUUID(),
            userId: clientTest.id,
            user: clientTest.toData() as IUser
        } as IAuth);

        param = new ForgotPasswordByEmailCommandInput();
        param.email = 'user.test@localhost.com';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Forgot password by email with account authorization is not exist error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(null);

        const error: SystemError = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'account authorization');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email with client account is not exist error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(null);

        const error: SystemError = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email with client account has not been activated error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        clientTest.status = ClientStatus.Inactived;
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);

        const error: SystemError = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email with manager account is not exist error', async () => {
        authTest = new Auth({
            id: randomUUID(),
            userId: managerTest.id,
            user: managerTest.toData() as IUser
        } as IAuth);
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(managerRepository, 'getById').resolves(null);

        const error: SystemError = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email with manager account has not been activated error', async () => {
        authTest = new Auth({
            id: randomUUID(),
            userId: managerTest.id,
            user: managerTest.toData() as IUser
        } as IAuth);
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        managerTest.status = ManagerStatus.Archived;
        sandbox.stub(managerRepository, 'getById').resolves(managerTest);

        const error: SystemError = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Forgot password by email', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);
        sandbox.stub(authRepository, 'update').resolves(true);
        sandbox.stub(mailService, 'sendForgotPassword').resolves();

        const result = await forgotPasswordByEmailCommandHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
