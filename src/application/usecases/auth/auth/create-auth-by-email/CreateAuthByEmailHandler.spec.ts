import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { AuthType } from 'domain/enums/auth/AuthType';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { expect } from 'chai';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { CreateAuthByEmailHandler } from './CreateAuthByEmailHandler';
import { CreateAuthByEmailInput } from './CreateAuthByEmailInput';

describe('Authorization usecases - Create authorization by email', () => {
  const sandbox = createSandbox();
  let authRepository: IAuthRepository;
  let createAuthByEmailHandler: CreateAuthByEmailHandler;
  let authTests: Auth[];
  let param: CreateAuthByEmailInput;

  before(() => {
    authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getAllByUser']);
    createAuthByEmailHandler = new CreateAuthByEmailHandler(authRepository);
  });

  beforeEach(() => {
    const auth = new Auth();
    auth.type = AuthType.PersonalEmail;
    authTests = [auth];

    param = new CreateAuthByEmailInput();
    param.userId = randomUUID();
    param.email = 'user.test@localhost.com';
    param.password = 'Nodecore@2';
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Container.reset();
  });

  it('Create authorization by email with data is already existed error', async () => {
    sandbox.stub(authRepository, 'getAllByUser').resolves(authTests);

    const usecaseOption = new UsecaseOption();
    const error: LogicalError = await createAuthByEmailHandler.handle(param, usecaseOption).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_EXISTED, { t: 'data' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Create authorization by email', async () => {
    sandbox.stub(authRepository, 'getAllByUser').resolves([]);
    const id = randomUUID();
    sandbox.stub(authRepository, 'create').resolves(id);

    const usecaseOption = new UsecaseOption();
    const result = await createAuthByEmailHandler.handle(param, usecaseOption);
    expect(result.data).to.eq(id);
  });
});
