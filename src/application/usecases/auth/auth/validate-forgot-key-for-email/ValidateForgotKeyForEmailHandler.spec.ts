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
import { expect } from 'chai';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { addMinutes } from 'utils/Datetime';
import { ValidateForgotKeyForEmailHandler } from './ValidateForgotKeyForEmailHandler';
import { ValidateForgotKeyForEmailInput } from './ValidateForgotKeyForEmailSchema';

describe('Authorization usecases - Validate forgot key for email', () => {
  const sandbox = createSandbox();
  let authRepository: IAuthRepository;
  let clientRepository: IClientRepository;
  let managerRepository: IManagerRepository;
  let validateForgotKeyForEmailHandler: ValidateForgotKeyForEmailHandler;
  let clientTest: Client;
  let managerTest: Manager;
  let authTest: Auth;
  let param: ValidateForgotKeyForEmailInput;

  before(() => {
    authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getByUsername']);
    clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
    managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
    validateForgotKeyForEmailHandler = new ValidateForgotKeyForEmailHandler(authRepository, clientRepository, managerRepository);
  });

  beforeEach(() => {
    clientTest = new Client();
    clientTest.id = randomUUID();
    clientTest.roleId = RoleId.Client;
    clientTest.email = 'client.test@localhost.com';
    clientTest.status = ClientStatus.Actived;

    managerTest = new Manager();
    managerTest.id = randomUUID();
    managerTest.roleId = RoleId.Manager;
    managerTest.email = 'manager.test@localhost.com';
    managerTest.status = ManagerStatus.Actived;

    authTest = new Auth();
    authTest.id = randomUUID();
    authTest.userId = clientTest.id;
    authTest.username = clientTest.email;
    authTest.user = clientTest;
    authTest.type = AuthType.PersonalEmail;
    authTest.forgotKey = 'forgot key';
    authTest.forgotExpire = addMinutes(new Date(), 10);

    param = new ValidateForgotKeyForEmailInput();
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
    sandbox.stub(authRepository, 'getByUsername').resolves();

    const result = await validateForgotKeyForEmailHandler.handle(param);
    expect(result.data).to.eq(false);
  });

  it('Validate forgot key for email with client account is not exist or activated error', async () => {
    clientTest.status = ClientStatus.Unverified;
    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    sandbox.stub(clientRepository, 'get').resolves();

    const result = await validateForgotKeyForEmailHandler.handle(param);
    expect(result.data).to.eq(false);
  });

  it('Validate forgot key for email with manager account is not exist or activated error', async () => {
    managerTest.status = ManagerStatus.Archived;
    const authTest = new Auth();
    authTest.id = randomUUID();
    authTest.userId = managerTest.id;
    authTest.username = managerTest.email;
    authTest.user = managerTest;
    authTest.type = AuthType.PersonalEmail;
    authTest.forgotKey = 'forgot key';
    authTest.forgotExpire = addMinutes(new Date(), 10);

    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    sandbox.stub(managerRepository, 'get').resolves();

    const result = await validateForgotKeyForEmailHandler.handle(param);
    expect(result.data).to.eq(false);
  });

  it('Validate forgot key for email', async () => {
    sandbox.stub(authRepository, 'getByUsername').resolves(authTest);
    sandbox.stub(clientRepository, 'get').resolves(clientTest);

    const result = await validateForgotKeyForEmailHandler.handle(param);
    expect(result.data).to.eq(true);
  });
});
