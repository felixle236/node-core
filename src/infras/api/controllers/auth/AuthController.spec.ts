import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Server } from 'http';
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockUserAuthentication } from '@shared/test/MockAuthentication';
import { mockAuthJwtService } from '@shared/test/MockAuthJwtService';
import { mockUsecase } from '@shared/test/MockUsecase';
import { mockWebApi } from '@shared/test/MockWebApi';
import { ForgotPasswordByEmailHandler } from '@usecases/auth/auth/forgot-password-by-email/ForgotPasswordByEmailHandler';
import { ForgotPasswordByEmailOutput } from '@usecases/auth/auth/forgot-password-by-email/ForgotPasswordByEmailOutput';
import { GetUserAuthByJwtHandler } from '@usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { LoginByEmailHandler } from '@usecases/auth/auth/login-by-email/LoginByEmailHandler';
import { LoginByEmailOutput } from '@usecases/auth/auth/login-by-email/LoginByEmailOutput';
import { ResetPasswordByEmailHandler } from '@usecases/auth/auth/reset-password-by-email/ResetPasswordByEmailHandler';
import { ResetPasswordByEmailOutput } from '@usecases/auth/auth/reset-password-by-email/ResetPasswordByEmailOutput';
import { UpdateMyPasswordByEmailHandler } from '@usecases/auth/auth/update-my-password-by-email/UpdateMyPasswordByEmailHandler';
import { UpdateMyPasswordByEmailOutput } from '@usecases/auth/auth/update-my-password-by-email/UpdateMyPasswordByEmailOutput';
import { ValidateForgotKeyForEmailHandler } from '@usecases/auth/auth/validate-forgot-key-for-email/ValidateForgotKeyForEmailHandler';
import { ValidateForgotKeyForEmailOutput } from '@usecases/auth/auth/validate-forgot-key-for-email/ValidateForgotKeyForEmailOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('Authorization controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3301;
    const endpoint = `http://localhost:${port}/api/v1/auths`;
    const options = { headers: { authorization: 'Bearer token' } };
    let getUserAuthByJwtHandler: GetUserAuthByJwtHandler;
    let loginByEmailHandler: LoginByEmailHandler;
    let forgotPasswordByEmailHandler: ForgotPasswordByEmailHandler;
    let validateForgotKeyForEmailHandler: ValidateForgotKeyForEmailHandler;
    let resetPasswordByEmailHandler: ResetPasswordByEmailHandler;
    let updateMyPasswordByEmailHandler: UpdateMyPasswordByEmailHandler;

    before(done => {
        Container.set('auth_jwt.service', mockAuthJwtService());

        import('./AuthController').then(obj => {
            server = mockWebApi(obj.AuthController, port, () => {
                Container.set(GetUserAuthByJwtHandler, mockUsecase());
                Container.set(LoginByEmailHandler, mockUsecase());
                Container.set(ForgotPasswordByEmailHandler, mockUsecase());
                Container.set(ValidateForgotKeyForEmailHandler, mockUsecase());
                Container.set(ResetPasswordByEmailHandler, mockUsecase());
                Container.set(UpdateMyPasswordByEmailHandler, mockUsecase());

                getUserAuthByJwtHandler = Container.get(GetUserAuthByJwtHandler);
                loginByEmailHandler = Container.get(LoginByEmailHandler);
                forgotPasswordByEmailHandler = Container.get(ForgotPasswordByEmailHandler);
                validateForgotKeyForEmailHandler = Container.get(ValidateForgotKeyForEmailHandler);
                resetPasswordByEmailHandler = Container.get(ResetPasswordByEmailHandler);
                updateMyPasswordByEmailHandler = Container.get(UpdateMyPasswordByEmailHandler);

                done();
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        Container.reset();
        server.close(done);
    });

    it('Get user authenticated by token invalid', async () => {
        const opt = JSON.parse(JSON.stringify(options));
        opt.headers.Authorization = 'Bearer';
        sandbox.stub(getUserAuthByJwtHandler, 'handle').throwsException(new InputValidationError());
        const { status, data } = await axios.get(endpoint, opt).catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new InputValidationError().code);
    });

    it('Login by email', async () => {
        const result = new LoginByEmailOutput();
        result.data = 'token';
        sandbox.stub(loginByEmailHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint + '/login', {
            email: 'user.test@localhost.com',
            password: 'Nodecore@2'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq('token');
    });

    it('Forgot password', async () => {
        const result = new ForgotPasswordByEmailOutput();
        result.data = true;
        sandbox.stub(forgotPasswordByEmailHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint + '/forgot-password', {
            email: 'user.test@localhost.com'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Forgot password', async () => {
        const result = new ValidateForgotKeyForEmailOutput();
        result.data = true;
        sandbox.stub(validateForgotKeyForEmailHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint + '/validate-forgot-key', {
            email: 'user.test@localhost.com',
            forgotKey: 'forgot key'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Reset password', async () => {
        const result = new ResetPasswordByEmailOutput();
        result.data = true;
        sandbox.stub(resetPasswordByEmailHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint + '/reset-password', {
            forgotKey: 'forgot key',
            email: 'user.test@localhost.com',
            password: 'Nodecore@2'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Update my password with unauthorized error', async () => {
        const { status, data } = await axios.patch(endpoint + '/password', undefined).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Update my password', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });
        const result = new UpdateMyPasswordByEmailOutput();
        result.data = true;
        sandbox.stub(updateMyPasswordByEmailHandler, 'handle').resolves(result);

        const { status, data } = await axios.patch(endpoint + '/password', {
            oldPassword: 'Nodecore@2',
            password: 'Nodecore@222'
        }, options).catch(error => error.response);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
