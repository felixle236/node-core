import 'reflect-metadata';
import 'mocha';
import { randomUUID, randomBytes } from 'crypto';
import { AuthType } from 'domain/enums/auth/AuthType';
import { Server } from 'http';
import { ForgotPasswordByEmailHandler } from 'application/usecases/auth/auth/forgot-password-by-email/ForgotPasswordByEmailHandler';
import { ForgotPasswordByEmailOutput } from 'application/usecases/auth/auth/forgot-password-by-email/ForgotPasswordByEmailSchema';
import { GetUserAuthByJwtHandler } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { LoginByEmailHandler } from 'application/usecases/auth/auth/login-by-email/LoginByEmailHandler';
import { LoginByEmailDataOutput, LoginByEmailOutput } from 'application/usecases/auth/auth/login-by-email/LoginByEmailSchema';
import { ResetPasswordByEmailHandler } from 'application/usecases/auth/auth/reset-password-by-email/ResetPasswordByEmailHandler';
import { ResetPasswordByEmailOutput } from 'application/usecases/auth/auth/reset-password-by-email/ResetPasswordByEmailSchema';
import { UpdateMyPasswordByEmailHandler } from 'application/usecases/auth/auth/update-my-password-by-email/UpdateMyPasswordByEmailHandler';
import { UpdateMyPasswordByEmailOutput } from 'application/usecases/auth/auth/update-my-password-by-email/UpdateMyPasswordByEmailSchema';
import { ValidateForgotKeyForEmailHandler } from 'application/usecases/auth/auth/validate-forgot-key-for-email/ValidateForgotKeyForEmailHandler';
import { ValidateForgotKeyForEmailOutput } from 'application/usecases/auth/auth/validate-forgot-key-for-email/ValidateForgotKeyForEmailSchema';
import axios from 'axios';
import { expect } from 'chai';
import { InputValidationError } from 'shared/exceptions/InputValidationError';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { mockUserAuthentication } from 'shared/test/MockAuthentication';
import { mockAuthJwtService } from 'shared/test/MockAuthJwtService';
import { mockInjection, mockUsecaseInjection } from 'shared/test/MockInjection';
import { mockMobileApi } from 'shared/test/MockMobileApi';
import { HttpHeaderKey } from 'shared/types/Common';
import { InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('Authorization controller', () => {
  const sandbox = createSandbox();
  let server: Server;
  const port = 6789;
  const endpoint = `http://localhost:${port}/api/v1/auths`;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const options = { headers: { [HttpHeaderKey.Authorization]: 'Bearer token' } };
  let getUserAuthByJwtHandler: GetUserAuthByJwtHandler;
  let loginByEmailHandler: LoginByEmailHandler;
  let forgotPasswordByEmailHandler: ForgotPasswordByEmailHandler;
  let validateForgotKeyForEmailHandler: ValidateForgotKeyForEmailHandler;
  let resetPasswordByEmailHandler: ResetPasswordByEmailHandler;
  let updateMyPasswordByEmailHandler: UpdateMyPasswordByEmailHandler;

  before((done) => {
    mockInjection(InjectService.AuthJwt, mockAuthJwtService());

    import('./AuthController').then((obj) => {
      server = mockMobileApi(obj.AuthController, port, () => {
        getUserAuthByJwtHandler = mockUsecaseInjection(GetUserAuthByJwtHandler);
        loginByEmailHandler = mockUsecaseInjection(LoginByEmailHandler);
        forgotPasswordByEmailHandler = mockUsecaseInjection(ForgotPasswordByEmailHandler);
        validateForgotKeyForEmailHandler = mockUsecaseInjection(ValidateForgotKeyForEmailHandler);
        resetPasswordByEmailHandler = mockUsecaseInjection(ResetPasswordByEmailHandler);
        updateMyPasswordByEmailHandler = mockUsecaseInjection(UpdateMyPasswordByEmailHandler);

        done();
      });
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  after((done) => {
    Container.reset();
    server.close(done);
  });

  it('Get user authenticated by token invalid', async () => {
    const opt = JSON.parse(JSON.stringify(options));
    opt.headers[HttpHeaderKey.Authorization] = 'Bearer';
    sandbox.stub(getUserAuthByJwtHandler, 'handle').throwsException(new InputValidationError());
    const { status, data } = await axios.get(endpoint, opt).catch((error) => error.response);

    expect(status).to.eq(400);
    expect(data.code).to.eq(new InputValidationError().code);
  });

  it('Login by email', async () => {
    const result = new LoginByEmailOutput();
    result.data = new LoginByEmailDataOutput();
    result.data.token = 'token';
    result.data.userId = 'user id';
    result.data.roleId = 'role id';
    result.data.type = AuthType.PersonalEmail;
    sandbox.stub(loginByEmailHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.post(endpoint + '/login', {
      email: 'user.test@localhost.com',
      password: 'Nodecore@2',
    });

    expect(status).to.eq(200);
    expect(data.data.token).to.eq('token');
  });

  it('Forgot password', async () => {
    const result = new ForgotPasswordByEmailOutput();
    result.data = true;
    sandbox.stub(forgotPasswordByEmailHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.post(endpoint + '/forgot-password', {
      email: 'user.test@localhost.com',
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
      forgotKey: randomBytes(32).toString('hex'),
    });

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Reset password', async () => {
    const result = new ResetPasswordByEmailOutput();
    result.data = true;
    sandbox.stub(resetPasswordByEmailHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.post(endpoint + '/reset-password', {
      forgotKey: randomBytes(32).toString('hex'),
      email: 'user.test@localhost.com',
      password: 'Nodecore@2',
    });

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Update my password with unauthorized error', async () => {
    const { status, data } = await axios.patch(endpoint + '/password', undefined).catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Update my password', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });
    const result = new UpdateMyPasswordByEmailOutput();
    result.data = true;
    sandbox.stub(updateMyPasswordByEmailHandler, 'handle').resolves(result);

    const { status, data } = await axios.patch(
      endpoint + '/password',
      {
        oldPassword: 'Nodecore@2',
        password: 'Nodecore@222',
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });
});
