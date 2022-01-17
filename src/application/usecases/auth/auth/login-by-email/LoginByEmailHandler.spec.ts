import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Client } from 'domain/entities/user/Client';
import { Manager } from 'domain/entities/user/Manager';
import { AuthType } from 'domain/enums/auth/AuthType';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { expect } from 'chai';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockAuthJwtService } from 'shared/test/MockAuthJwtService';
import { mockInjection, mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { LoginByEmailHandler } from './LoginByEmailHandler';
import { LoginByEmailInput } from './LoginByEmailSchema';

describe('Authorization usecases - Login by email', () => {
  const sandbox = createSandbox();
  let authRepository: IAuthRepository;
  let clientRepository: IClientRepository;
  let managerRepository: IManagerRepository;
  let authJwtService: IAuthJwtService;
  let loginByEmailHandler: LoginByEmailHandler;
  let clientTest: Client;
  let managerTest: Manager;
  let authTest: Auth;
  let param: LoginByEmailInput;

  before(() => {
    authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getByUsername']);
    clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
    managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
    authJwtService = mockInjection<IAuthJwtService>(InjectService.AuthJwt, mockAuthJwtService());
    loginByEmailHandler = new LoginByEmailHandler(authRepository, clientRepository, managerRepository, authJwtService);
  });

  beforeEach(() => {
    clientTest = new Client();
    clientTest.id = randomUUID();
    clientTest.roleId = RoleId.Client;
    clientTest.firstName = 'client';
    clientTest.lastName = 'test';
    clientTest.status = ClientStatus.Actived;

    managerTest = new Manager();
    managerTest.id = randomUUID();
    managerTest.roleId = RoleId.Manager;
    managerTest.status = ManagerStatus.Actived;

    authTest = new Auth();
    authTest.id = randomUUID();
    authTest.userId = clientTest.id;
    authTest.username = 'user.test@localhost.com';
    authTest.user = clientTest;
    authTest.type = AuthType.PersonalEmail;

    const password = 'Nodecore@2';
    authTest.password = Auth.hashPassword(password);

    param = new LoginByEmailInput();
    param.email = authTest.username;
    param.password = password;
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Container.reset();
  });

  it('Login by email with email or password is incorrect error', async () => {
    sandbox.stub(authRepository, 'getByUsername').resolves();

    const error: LogicalError = await loginByEmailHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_INCORRECT, { t: 'email_or_password' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Login by email with client account is not exist error', async () => {
    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    sandbox.stub(clientRepository, 'get').resolves();

    const error: LogicalError = await loginByEmailHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Login by email with client account has not been activated error', async () => {
    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    clientTest.status = ClientStatus.Inactived;
    sandbox.stub(clientRepository, 'get').resolves(clientTest);

    const error: LogicalError = await loginByEmailHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Login by email with manager account is not exist error', async () => {
    authTest = new Auth();
    authTest.id = randomUUID();
    authTest.userId = managerTest.id;
    authTest.username = 'user.test@localhost.com';
    authTest.user = managerTest;
    authTest.password = Auth.hashPassword('Nodecore@2');

    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    sandbox.stub(managerRepository, 'get').resolves();

    const error: LogicalError = await loginByEmailHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_NOT_EXISTS, { t: 'account' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Login by email with manager account has not been activated error', async () => {
    authTest = new Auth();
    authTest.id = randomUUID();
    authTest.userId = managerTest.id;
    authTest.username = 'user.test@localhost.com';
    authTest.user = managerTest;
    authTest.type = AuthType.PersonalEmail;
    authTest.password = Auth.hashPassword('Nodecore@2');

    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    managerTest.status = ManagerStatus.Archived;
    sandbox.stub(managerRepository, 'get').resolves(managerTest);

    const error: LogicalError = await loginByEmailHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_NOT_ACTIVATED, { t: 'account' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Login by email', async () => {
    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    sandbox.stub(clientRepository, 'get').resolves(clientTest);

    const token = authJwtService.sign(authTest.userId, clientTest.roleId, authTest.type);
    const result = await loginByEmailHandler.handle(param);
    expect(result.data.token).to.eq(token);
  });
});
