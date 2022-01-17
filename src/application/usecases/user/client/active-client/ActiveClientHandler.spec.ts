import 'reflect-metadata';
import 'mocha';
import crypto, { randomUUID } from 'crypto';
import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { expect } from 'chai';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { addSeconds } from 'utils/Datetime';
import { ActiveClientHandler } from './ActiveClientHandler';
import { ActiveClientInput } from './ActiveClientInput';

describe('Client usecases - Active client', () => {
  const sandbox = createSandbox();
  let clientRepository: IClientRepository;
  let activeClientHandler: ActiveClientHandler;
  let clientTest: Client;

  before(() => {
    clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client, ['getByEmail']);
    activeClientHandler = new ActiveClientHandler(clientRepository);
  });

  beforeEach(() => {
    clientTest = new Client();
    clientTest.id = randomUUID();
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Container.reset();
  });

  it('Active client with params invalid error - Email not exist', async () => {
    sandbox.stub(clientRepository, 'getByEmail').resolves();

    const param = new ActiveClientInput();
    param.email = 'test@localhost.com';
    param.activeKey = crypto.randomBytes(32).toString('hex');

    const error = await activeClientHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.DATA_INVALID);

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Active client with params invalid error - Active key not matched', async () => {
    sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);

    const param = new ActiveClientInput();
    param.email = 'test@localhost.com';
    param.activeKey = crypto.randomBytes(32).toString('hex');

    const error = await activeClientHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.DATA_INVALID);

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Active client with params invalid error - Account is actived already', async () => {
    clientTest.activeKey = crypto.randomBytes(32).toString('hex');
    clientTest.status = ClientStatus.Actived;
    sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);

    const param = new ActiveClientInput();
    param.email = 'test@localhost.com';
    param.activeKey = clientTest.activeKey;

    const error = await activeClientHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.DATA_INVALID);

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Active client with active key expired error', async () => {
    clientTest.activeKey = crypto.randomBytes(32).toString('hex');
    clientTest.activeExpire = addSeconds(new Date(), -1);
    sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);

    const param = new ActiveClientInput();
    param.email = 'test@localhost.com';
    param.activeKey = clientTest.activeKey;

    const error = await activeClientHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_EXPIRED, { t: 'activation_key' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Active client', async () => {
    clientTest.activeKey = crypto.randomBytes(32).toString('hex');
    clientTest.activeExpire = addSeconds(new Date(), 1);
    sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);
    sandbox.stub(clientRepository, 'update').resolves(true);

    const param = new ActiveClientInput();
    param.email = 'test@localhost.com';
    param.activeKey = clientTest.activeKey;

    const result = await activeClientHandler.handle(param);
    expect(result.data).to.eq(true);
  });
});
