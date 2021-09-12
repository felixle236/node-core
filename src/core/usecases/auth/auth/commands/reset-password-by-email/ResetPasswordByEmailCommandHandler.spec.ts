/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import crypto, { randomUUID } from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IClient } from '@domain/interfaces/user/IClient';
import { IUser } from '@domain/interfaces/user/IUser';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { addMinutes } from '@utils/datetime';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ResetPasswordByEmailCommandHandler } from './ResetPasswordByEmailCommandHandler';
import { ResetPasswordByEmailCommandInput } from './ResetPasswordByEmailCommandInput';

describe('Authorization usecases - Reset password by email', () => {
    const sandbox = createSandbox();
    let authRepository: IAuthRepository;
    let resetPasswordByEmailCommandHandler: ResetPasswordByEmailCommandHandler;
    let clientTest: Client;
    let authTest: Auth;
    let param: ResetPasswordByEmailCommandInput;

    before(() => {
        Container.set('auth.repository', {
            getByUsername() {},
            update() {}
        });

        authRepository = Container.get<IAuthRepository>('auth.repository');
        resetPasswordByEmailCommandHandler = Container.get(ResetPasswordByEmailCommandHandler);
    });

    beforeEach(() => {
        const forgotKey = crypto.randomBytes(32).toString('hex');
        clientTest = new Client({
            id: randomUUID(),
            roleId: RoleId.Client,
            firstName: 'client',
            lastName: 'test',
            status: ClientStatus.Actived
        } as IClient);
        authTest = new Auth({
            id: randomUUID(),
            userId: clientTest.id,
            forgotKey,
            forgotExpire: addMinutes(new Date(), 10),
            user: clientTest.toData() as IUser
        } as IAuth);

        param = new ResetPasswordByEmailCommandInput();
        param.forgotKey = forgotKey;
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

    it('Reset password by email with forgot key is incorrect error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        authTest.forgotKey = crypto.randomBytes(32).toString('hex');

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_INCORRECT, 'forgot key');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email with forgot key has expired error', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        authTest.forgotExpire = addMinutes(new Date(), -10);

        const error: SystemError = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXPIRED, 'forgot key');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Reset password by email successful', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
        sandbox.stub(authRepository, 'update').resolves(true);

        const result = await resetPasswordByEmailCommandHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
