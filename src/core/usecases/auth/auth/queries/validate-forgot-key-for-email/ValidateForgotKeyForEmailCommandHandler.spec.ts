/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Auth } from '@domain/entities/auth/Auth';
import { Client } from '@domain/entities/user/Client';
import { Manager } from '@domain/entities/user/Manager';
import { AuthType } from '@domain/enums/auth/AuthType';
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
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { ValidateForgotKeyForEmailCommandHandler } from './ValidateForgotKeyForEmailCommandHandler';
import { ValidateForgotKeyForEmailCommandInput } from './ValidateForgotKeyForEmailCommandInput';

describe('Auth - Validate forgot key for email', () => {
    const sandbox = createSandbox();
    let authRepository: IAuthRepository;
    let clientRepository: IClientRepository;
    let managerRepository: IManagerRepository;
    let validateForgotKeyForEmailCommandHandler: ValidateForgotKeyForEmailCommandHandler;
    let clientTest: Client;
    let managerTest: Manager;
    let authTest: Auth;
    let param: ValidateForgotKeyForEmailCommandInput;

    before(() => {
        Container.set('auth.repository', {
            getByUsername() {}
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
        validateForgotKeyForEmailCommandHandler = Container.get(ValidateForgotKeyForEmailCommandHandler);
    });

    beforeEach(() => {
        clientTest = new Client({
            id: v4(),
            roleId: RoleId.CLIENT,
            email: 'client.test@localhost.com',
            status: ClientStatus.ACTIVED
        } as IClient);
        managerTest = new Manager({
            id: v4(),
            roleId: RoleId.MANAGER,
            email: 'manager.test@localhost.com',
            status: ManagerStatus.ACTIVED
        } as IManager);
        authTest = new Auth({
            id: v4(),
            userId: clientTest.id,
            username: clientTest.email,
            user: clientTest.toData() as IUser,
            type: AuthType.PERSONAL_EMAIL,
            forgotKey: 'forgot key',
            forgotExpire: addMinutes(new Date(), 10)
        } as IAuth);

        param = new ValidateForgotKeyForEmailCommandInput();
        param.email = authTest.username;
        param.forgotKey = 'forgot key';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Validate forgot key for email with data is not exist error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(null);

        const result = await validateForgotKeyForEmailCommandHandler.handle(param);
        expect(result.data).to.eq(false);
    });

    it('Validate forgot key for email with client account is not exist or activated error', async () => {
        clientTest.status = ClientStatus.INACTIVED;
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(null);

        const result = await validateForgotKeyForEmailCommandHandler.handle(param);
        expect(result.data).to.eq(false);
    });

    it('Validate forgot key for email with manager account is not exist or activated error', async () => {
        managerTest.status = ManagerStatus.ARCHIVED;
        const authTest = new Auth({
            id: v4(),
            userId: managerTest.id,
            username: managerTest.email,
            user: managerTest.toData() as IUser,
            type: AuthType.PERSONAL_EMAIL,
            forgotKey: 'forgot key',
            forgotExpire: addMinutes(new Date(), 10)
        } as IAuth);
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(managerRepository, 'getById').resolves(null);

        const result = await validateForgotKeyForEmailCommandHandler.handle(param);
        expect(result.data).to.eq(false);
    });

    it('Validate forgot key for email', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);

        const result = await validateForgotKeyForEmailCommandHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
