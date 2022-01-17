import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IMailService } from 'application/interfaces/services/IMailService';
import { CreateAuthByEmailHandler } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { expect } from 'chai';
import { Request } from 'express';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockDbContext } from 'shared/test/MockDbContext';
import { mockFunction } from 'shared/test/MockFunction';
import { mockInjection, mockRepositoryInjection, mockUsecaseInjection } from 'shared/test/MockInjection';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { RegisterClientHandler } from './RegisterClientHandler';
import { RegisterClientInput } from './RegisterClientSchema';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';
import { CheckEmailExistOutput } from '../../user/check-email-exist/CheckEmailExistSchema';

describe('Client usecases - Register client', () => {
  const sandbox = createSandbox();
  let dbContext: IDbContext;
  let mailService: IMailService;
  let clientRepository: IClientRepository;
  let authRepository: IAuthRepository;
  let checkEmailExistHandler: CheckEmailExistHandler;
  let createAuthByEmailHandler: CreateAuthByEmailHandler;
  let registerClientHandler: RegisterClientHandler;
  let param: RegisterClientInput;

  before(async () => {
    dbContext = await mockDbContext();
    mailService = mockInjection(InjectService.Mail, {
      sendUserActivation: mockFunction(),
    });
    clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
    authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getByUsername']);
    checkEmailExistHandler = mockUsecaseInjection(CheckEmailExistHandler);
    createAuthByEmailHandler = mockUsecaseInjection(CreateAuthByEmailHandler);

    registerClientHandler = new RegisterClientHandler(
      dbContext,
      mailService,
      checkEmailExistHandler,
      createAuthByEmailHandler,
      clientRepository,
      authRepository,
    );
  });

  beforeEach(() => {
    param = new RegisterClientInput();
    param.firstName = 'Client';
    param.lastName = 'Test';
    param.email = 'client.test@localhost.com';
    param.password = 'Nodecore@2';
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(async () => {
    Container.reset();
    await dbContext.destroyConnection();
  });

  it('Register client with email exist error', async () => {
    const checkEmailResult = new CheckEmailExistOutput();
    checkEmailResult.data = true;
    sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);

    const usecaseOption = new UsecaseOption();
    usecaseOption.req = {} as Request;
    const error: LogicalError = await registerClientHandler.handle(param, usecaseOption).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Register client with user authorization exist error', async () => {
    const checkEmailResult = new CheckEmailExistOutput();
    checkEmailResult.data = false;
    sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
    const auth = new Auth();
    sandbox.stub(authRepository, 'getByUsername').resolves(auth);

    const usecaseOption = new UsecaseOption();
    usecaseOption.req = {} as Request;
    const error: LogicalError = await registerClientHandler.handle(param, usecaseOption).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Register client', async () => {
    const checkEmailResult = new CheckEmailExistOutput();
    checkEmailResult.data = false;
    sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
    sandbox.stub(authRepository, 'getByUsername').resolves();
    sandbox.stub(clientRepository, 'create').resolves(randomUUID());

    const usecaseOption = new UsecaseOption();
    usecaseOption.req = {} as Request;
    const result = await registerClientHandler.handle(param, usecaseOption);
    expect(result.data).to.eq(true);
  });
});
