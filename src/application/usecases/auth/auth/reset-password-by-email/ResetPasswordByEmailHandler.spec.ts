import 'reflect-metadata';
import 'mocha';
import crypto, { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { expect } from 'chai';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { addMinutes } from 'utils/Datetime';
import { ResetPasswordByEmailHandler } from './ResetPasswordByEmailHandler';
import { ResetPasswordByEmailInput } from './ResetPasswordByEmailInput';

describe('Authorization usecases - Reset password by email', () => {
  const sandbox = createSandbox();
  let authRepository: IAuthRepository;
  let resetPasswordByEmailHandler: ResetPasswordByEmailHandler;
  let clientTest: Client;
  let authTest: Auth;
  let param: ResetPasswordByEmailInput;

  before(() => {
    authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getByUsername']);
    resetPasswordByEmailHandler = new ResetPasswordByEmailHandler(authRepository);
  });

  beforeEach(() => {
    const forgotKey = crypto.randomBytes(32).toString('hex');
    clientTest = new Client();
    clientTest.id = randomUUID();
    clientTest.roleId = RoleId.Client;
    clientTest.firstName = 'client';
    clientTest.lastName = 'test';
    clientTest.status = ClientStatus.Actived;

    authTest = new Auth();
    authTest.id = randomUUID();
    authTest.userId = clientTest.id;
    authTest.forgotKey = forgotKey;
    authTest.forgotExpire = addMinutes(new Date(), 10);
    authTest.user = clientTest;

    param = new ResetPasswordByEmailInput();
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
    sandbox.stub(authRepository, 'getByUsername').resolves();

    const error: LogicalError = await resetPasswordByEmailHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Reset password by email with forgot key is incorrect error', async () => {
    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    authTest.forgotKey = crypto.randomBytes(32).toString('hex');

    const error: LogicalError = await resetPasswordByEmailHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_INCORRECT, { t: 'forgot_key' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Reset password by email with forgot key has expired error', async () => {
    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    authTest.forgotExpire = addMinutes(new Date(), -10);

    const error: LogicalError = await resetPasswordByEmailHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_EXPIRED, { t: 'forgot_key' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Reset password by email successful', async () => {
    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    sandbox.stub(authRepository, 'update').resolves(true);

    const result = await resetPasswordByEmailHandler.handle(param);
    expect(result.data).to.eq(true);
  });
});
