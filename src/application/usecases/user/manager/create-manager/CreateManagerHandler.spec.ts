import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { CreateAuthByEmailHandler } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { expect } from 'chai';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockDbContext } from 'shared/test/MockDbContext';
import { mockRepositoryInjection, mockUsecaseInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { CreateManagerHandler } from './CreateManagerHandler';
import { CreateManagerInput } from './CreateManagerSchema';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';
import { CheckEmailExistOutput } from '../../user/check-email-exist/CheckEmailExistSchema';

describe('Manager usecases - Create manager', () => {
  const sandbox = createSandbox();
  let dbContext: IDbContext;
  let managerRepository: IManagerRepository;
  let authRepository: IAuthRepository;
  let checkEmailExistHandler: CheckEmailExistHandler;
  let createAuthByEmailHandler: CreateAuthByEmailHandler;
  let createManagerHandler: CreateManagerHandler;
  let param: CreateManagerInput;

  before(async () => {
    dbContext = await mockDbContext();
    managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
    authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getByUsername']);
    checkEmailExistHandler = mockUsecaseInjection(CheckEmailExistHandler);
    createAuthByEmailHandler = mockUsecaseInjection(CreateAuthByEmailHandler);

    createManagerHandler = new CreateManagerHandler(dbContext, checkEmailExistHandler, createAuthByEmailHandler, managerRepository, authRepository);
  });

  beforeEach(() => {
    param = new CreateManagerInput();
    param.firstName = 'Manager';
    param.lastName = 'Test';
    param.email = 'manager.test@localhost.com';
    param.password = 'Nodecore@2';
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(async () => {
    Container.reset();
    await dbContext.destroyConnection();
  });

  it('Create manager with email exist error', async () => {
    const checkEmailResult = new CheckEmailExistOutput();
    checkEmailResult.data = true;
    sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);

    const error: LogicalError = await createManagerHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Create manager with user authorization exist error', async () => {
    const checkEmailResult = new CheckEmailExistOutput();
    checkEmailResult.data = false;
    sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
    const auth = new Auth();
    sandbox.stub(authRepository, 'getByUsername').resolves(auth);

    const error: LogicalError = await createManagerHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Create manager', async () => {
    const checkEmailResult = new CheckEmailExistOutput();
    checkEmailResult.data = false;
    sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
    sandbox.stub(authRepository, 'getByUsername').resolves();
    const id = randomUUID();
    sandbox.stub(managerRepository, 'create').resolves(id);

    const result = await createManagerHandler.handle(param);
    expect(result.data).to.eq(id);
  });
});
