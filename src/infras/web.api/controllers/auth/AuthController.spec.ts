/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Server } from 'http';
import { AuthType } from '@domain/enums/auth/AuthType';
import { mockAuthentication } from '@shared/test/MockAuthentication';
import { mockApiService } from '@shared/test/MockWebApi';
import { ForgotPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandHandler';
import { ForgotPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/forgot-password-by-email/ForgotPasswordByEmailCommandOutput';
import { ResetPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/reset-password-by-email/ResetPasswordByEmailCommandHandler';
import { ResetPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/reset-password-by-email/ResetPasswordByEmailCommandOutput';
import { UpdateMyPasswordByEmailCommandHandler } from '@usecases/auth/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandHandler';
import { UpdateMyPasswordByEmailCommandOutput } from '@usecases/auth/auth/commands/update-my-password-by-email/UpdateMyPasswordByEmailCommandOutput';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryOutput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryOutput';
import { LoginByEmailQueryHandler } from '@usecases/auth/auth/queries/login-by-email/LoginByEmailQueryHandler';
import { LoginByEmailQueryOutput } from '@usecases/auth/auth/queries/login-by-email/LoginByEmailQueryOutput';
import { ValidateForgotKeyForEmailCommandHandler } from '@usecases/auth/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommandHandler';
import { ValidateForgotKeyForEmailCommandOutput } from '@usecases/auth/auth/queries/validate-forgot-key-for-email/ValidateForgotKeyForEmailCommandOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { AuthController } from './AuthController';

describe('Authorization controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3000;
    const endpoint = `http://localhost:${port}/api/v1/auths`;
    let getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler;
    let loginByEmailQueryHandler: LoginByEmailQueryHandler;
    let forgotPasswordByEmailCommandHandler: ForgotPasswordByEmailCommandHandler;
    let validateForgotKeyForEmailCommandHandler: ValidateForgotKeyForEmailCommandHandler;
    let resetPasswordByEmailCommandHandler: ResetPasswordByEmailCommandHandler;
    let updateMyPasswordByEmailCommandHandler: UpdateMyPasswordByEmailCommandHandler;

    before(done => {
        server = mockApiService(AuthController, port, () => {
            Container.set(GetUserAuthByJwtQueryHandler, { handle() {} });
            Container.set(LoginByEmailQueryHandler, { handle() {} });
            Container.set(ForgotPasswordByEmailCommandHandler, { handle() {} });
            Container.set(ValidateForgotKeyForEmailCommandHandler, { handle() {} });
            Container.set(ResetPasswordByEmailCommandHandler, { handle() {} });
            Container.set(UpdateMyPasswordByEmailCommandHandler, { handle() {} });

            getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
            loginByEmailQueryHandler = Container.get(LoginByEmailQueryHandler);
            forgotPasswordByEmailCommandHandler = Container.get(ForgotPasswordByEmailCommandHandler);
            validateForgotKeyForEmailCommandHandler = Container.get(ValidateForgotKeyForEmailCommandHandler);
            resetPasswordByEmailCommandHandler = Container.get(ResetPasswordByEmailCommandHandler);
            updateMyPasswordByEmailCommandHandler = Container.get(UpdateMyPasswordByEmailCommandHandler);

            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        Container.reset();
        server.close(done);
    });

    it('Authenticate user by token', async () => {
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: v4(),
            roleId: v4(),
            type: AuthType.PERSONAL_EMAIL
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.post(endpoint);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Login by email', async () => {
        const result = new LoginByEmailQueryOutput();
        result.setData('token');
        sandbox.stub(loginByEmailQueryHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/login', {
            email: 'user.test@localhost.com',
            password: 'Nodecore@2'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq('token');
    });

    it('Forgot password', async () => {
        const result = new ForgotPasswordByEmailCommandOutput();
        result.setData(true);
        sandbox.stub(forgotPasswordByEmailCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/forgot-password', {
            email: 'user.test@localhost.com'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Forgot password', async () => {
        const result = new ValidateForgotKeyForEmailCommandOutput();
        result.setData(true);
        sandbox.stub(validateForgotKeyForEmailCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/validate-forgot-key', {
            email: 'user.test@localhost.com',
            forgotKey: 'forgot key'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Reset password', async () => {
        const result = new ResetPasswordByEmailCommandOutput();
        result.setData(true);
        sandbox.stub(resetPasswordByEmailCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/reset-password', {
            forgotKey: 'forgot key',
            email: 'user.test@localhost.com',
            password: 'Nodecore@2'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Update my password', async () => {
        mockAuthentication({ userId: v4(), roleId: v4() } as any);
        const result = new UpdateMyPasswordByEmailCommandOutput();
        result.setData(true);
        sandbox.stub(updateMyPasswordByEmailCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.patch(endpoint + '/password', {
            oldPassword: 'Nodecore@2',
            password: 'Nodecore@222'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
