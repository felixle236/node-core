/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
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
import { addMinutes } from '@utils/datetime';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ValidateForgotKeyForEmailCommandHandler } from './ValidateForgotKeyForEmailCommandHandler';
import { ValidateForgotKeyForEmailCommandInput } from './ValidateForgotKeyForEmailCommandInput';

describe('Authorization usecases - Validate forgot key for email', () => {
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
            id: randomUUID(),
            roleId: RoleId.Client,
            email: 'client.test@localhost.com',
            status: ClientStatus.Actived
        } as IClient);
        managerTest = new Manager({
            id: randomUUID(),
            roleId: RoleId.Manager,
            email: 'manager.test@localhost.com',
            status: ManagerStatus.Actived
        } as IManager);
        authTest = new Auth({
            id: randomUUID(),
            userId: clientTest.id,
            username: clientTest.email,
            user: clientTest.toData() as IUser,
            type: AuthType.PersonalEmail,
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
        clientTest.status = ClientStatus.Inactived;
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(clientRepository, 'getById').resolves(null);

        const result = await validateForgotKeyForEmailCommandHandler.handle(param);
        expect(result.data).to.eq(false);
    });

    it('Validate forgot key for email with manager account is not exist or activated error', async () => {
        managerTest.status = ManagerStatus.Archived;
        const authTest = new Auth({
            id: randomUUID(),
            userId: managerTest.id,
            username: managerTest.email,
            user: managerTest.toData() as IUser,
            type: AuthType.PersonalEmail,
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
