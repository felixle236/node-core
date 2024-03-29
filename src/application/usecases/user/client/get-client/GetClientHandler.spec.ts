import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Client } from 'domain/entities/user/Client';
import { GenderType } from 'domain/enums/user/GenderType';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { AddressInfoData } from 'application/usecases/common/AddressInfoData';
import { expect } from 'chai';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { GetClientHandler } from './GetClientHandler';

describe('Client usecases - Get client', () => {
  const sandbox = createSandbox();
  let clientRepository: IClientRepository;
  let getClientHandler: GetClientHandler;
  let clientTest: Client;

  before(() => {
    clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
    getClientHandler = new GetClientHandler(clientRepository);
  });

  beforeEach(() => {
    clientTest = new Client();
    clientTest.id = randomUUID();
    clientTest.firstName = 'Client';
    clientTest.lastName = 'Test';
    clientTest.email = 'client.test@localhost.com';
    clientTest.avatar = 'avatar.png';
    clientTest.gender = GenderType.Female;
    clientTest.birthday = '1970-01-01';
    clientTest.phone = '0123456789';
    clientTest.address = new AddressInfoData();
    clientTest.address.street = '123 Abc';
    clientTest.locale = 'en-US';
    clientTest.activedAt = new Date();
    clientTest.archivedAt = new Date();
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Container.reset();
  });

  it('Get client with not found error', async () => {
    sandbox.stub(clientRepository, 'get').resolves();

    const error = await getClientHandler.handle(clientTest.id).catch((error) => error);
    const err = new NotFoundError();

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Get client', async () => {
    sandbox.stub(clientRepository, 'get').resolves(clientTest);

    const result = await getClientHandler.handle(clientTest.id);
    expect(result.data.id).to.eq(clientTest.id);
  });
});
