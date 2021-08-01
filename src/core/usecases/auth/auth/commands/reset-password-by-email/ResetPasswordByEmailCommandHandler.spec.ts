/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
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
import { addMinutes } from '@libs/date';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { ResetPasswordByEmailCommandHandler } from './ResetPasswordByEmailCommandHandler';
import { ResetPasswordByEmailCommandInput } from './ResetPasswordByEmailCommandInput';

describe('Authorization usecases - Reset password by email', () => {
    const sandbox = createSandbox();
    let authRepository: IAuthRepository;
    let clientRepository: IClientRepository;
    let managerRepository: IManagerRepository;
    let resetPasswordByEmailCommandHandler: ResetPasswordByEmailCommandHandler;
    let clientTest: Client;
    let managerTest: Manager;
    let authTest: Auth;
    let param: ResetPasswordByEmailCommandInput;

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

        authRepository = Container.get<IAuthRepository>('auth.repository');
        clientRepository = Container.get<IClientRepository>('client.repository');
        managerRepository = Container.get<IManagerRepository>('manager.repository');
        resetPasswordByEmailCommandHandler = Container.get(ResetPasswordByEmailCommandHandler);
    });

    beforeEach(() => {
        clientTest = new Client({
            id: v4(),
            roleId: RoleId.CLIENT,
            firstName: 'client',
            lastName: 'test',
            status: ClientStatus.ACTIVED
        } as IClient);
        managerTest = new Manager({
            id: v4(),
            roleId: RoleId.MANAGER,
            status: ManagerStatus.ACTIVED
        } as IManager);
        authTest = new Auth({
            id: v4(),
            userId: clientTest.id,
            forgotKey: 'forgot key',
            forgotExpire: addMinutes(new Date(), 10),
            user: clientTest.toData() as IUser
        } as IAuth);

        param = new ResetPasswordByEmailCommandInput();
        param.forgotKey = 'forgot key';
        param.email = 'user.test@localhost.com';
        param.password = 'Nodecore@2';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Reset password by email with account authorization is not exist error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(null);

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'account authorization');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email with client account is not exist error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(null);

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email with client account has not been activated error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        clientTest.status = ClientStatus.INACTIVED;
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email with manager account is not exist error', async () => {
        authTest = new Auth({
            id: v4(),
            userId: managerTest.id,
            user: managerTest.toData() as IUser
        } as IAuth);
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(managerRepository, 'getById').resolves(null);

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_EXISTS, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email with manager account has not been activated error', async () => {
        authTest = new Auth({
            id: v4(),
            userId: managerTest.id,
            user: managerTest.toData() as IUser
        } as IAuth);
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        managerTest.status = ManagerStatus.ARCHIVED;
        sandbox.stub(managerRepository, 'getById').resolves(managerTest);

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email with forgot key is incorrect error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);
        authTest.forgotKey = 'abc';

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_INCORRECT, 'forgot key');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email with forgot key has expired error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);
        authTest.forgotExpire = addMinutes(new Date(), -10);

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXPIRED, 'forgot key');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);
        sandbox.stub(authRepository, 'update').resolves(true);

        const result = await resetPasswordByEmailCommandHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
