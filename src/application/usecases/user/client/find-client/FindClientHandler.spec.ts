import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { GenderType } from 'domain/enums/user/GenderType';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { AddressInfoData } from 'application/usecases/common/AddressInfoData';
import { expect } from 'chai';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { FindClientHandler } from './FindClientHandler';
import { FindClientInput } from './FindClientSchema';

describe('Client usecases - Find client', () => {
  const sandbox = createSandbox();
  let clientRepository: IClientRepository;
  let findClientHandler: FindClientHandler;
  let list: Client[];

  before(() => {
    clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
    findClientHandler = new FindClientHandler(clientRepository);
  });

  beforeEach(() => {
    const client = new Client();
    client.id = randomUUID();
    client.firstName = 'Client';
    client.lastName = 'Test';
    client.email = 'client.test@localhost.com';
    client.avatar = 'avatar.png';
    client.gender = GenderType.Female;
    client.birthday = '1970-01-01';
    client.phone = '0123456789';
    client.address = new AddressInfoData();
    client.address.street = '123 Abc';
    client.locale = 'en-US';

    list = [client, client];
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Container.reset();
  });

  it('Find client', async () => {
    sandbox.stub(clientRepository, 'findAndCount').resolves([list, 10]);
    const param = new FindClientInput();

    const result = await findClientHandler.handle(param);
    expect(result.data.length).to.eq(2);
    expect(result.pagination.total).to.eq(10);
  });

  it('Find client with params', async () => {
    sandbox.stub(clientRepository, 'findAndCount').resolves([list, 10]);
    const param = new FindClientInput();
    param.keyword = 'test';
    param.status = ClientStatus.Actived;
    param.skip = 10;
    param.limit = 2;

    const result = await findClientHandler.handle(param);
    expect(result.data.length).to.eq(2);
    expect(result.pagination.total).to.eq(10);
  });
});
