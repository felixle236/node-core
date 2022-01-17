import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from 'domain/entities/user/Manager';
import { GenderType } from 'domain/enums/user/GenderType';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { expect } from 'chai';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { FindManagerHandler } from './FindManagerHandler';
import { FindManagerInput } from './FindManagerSchema';

describe('Manager usecases - Find manager', () => {
  const sandbox = createSandbox();
  let managerRepository: IManagerRepository;
  let findManagerHandler: FindManagerHandler;
  let list: Manager[];

  before(() => {
    managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
    findManagerHandler = new FindManagerHandler(managerRepository);
  });

  beforeEach(() => {
    const manager = new Manager();
    manager.id = randomUUID();
    manager.createdAt = new Date();
    manager.firstName = 'Manager';
    manager.lastName = 'Test';
    manager.email = 'manager.test@localhost.com';
    manager.avatar = 'avatar.png';
    manager.gender = GenderType.Female;
    manager.birthday = '2000-06-08';

    list = [manager, manager];
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Container.reset();
  });

  it('Find manager', async () => {
    sandbox.stub(managerRepository, 'findAndCount').resolves([list, 10]);
    const param = new FindManagerInput();

    const result = await findManagerHandler.handle(param);
    expect(result.data.length).to.eq(2);
    expect(result.pagination.total).to.eq(10);
  });

  it('Find manager with params', async () => {
    sandbox.stub(managerRepository, 'findAndCount').resolves([list, 10]);
    const param = new FindManagerInput();
    param.keyword = 'test';
    param.status = ManagerStatus.Actived;
    param.skip = 10;
    param.limit = 2;

    const result = await findManagerHandler.handle(param);
    expect(result.data.length).to.eq(2);
    expect(result.pagination.total).to.eq(10);
  });
});
