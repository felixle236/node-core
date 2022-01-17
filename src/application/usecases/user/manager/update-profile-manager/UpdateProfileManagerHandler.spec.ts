import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from 'domain/entities/user/Manager';
import { GenderType } from 'domain/enums/user/GenderType';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { expect } from 'chai';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UpdateProfileManagerHandler } from './UpdateProfileManagerHandler';
import { UpdateProfileManagerInput } from './UpdateProfileManagerSchema';

describe('Manager usecases - Update profile manager', () => {
  const sandbox = createSandbox();
  let managerRepository: IManagerRepository;
  let updateProfileManagerHandler: UpdateProfileManagerHandler;
  let managerTest: Manager;
  let param: UpdateProfileManagerInput;

  before(() => {
    managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
    updateProfileManagerHandler = new UpdateProfileManagerHandler(managerRepository);
  });

  beforeEach(() => {
    managerTest = new Manager();

    param = new UpdateProfileManagerInput();
    param.firstName = 'Manager';
    param.lastName = 'Test';
    param.gender = GenderType.Female;
    param.birthday = '2000-06-08';
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Container.reset();
  });

  it('Update profile manager with data not found error', async () => {
    sandbox.stub(managerRepository, 'get').resolves();
    const error = await updateProfileManagerHandler.handle(randomUUID(), param).catch((error) => error);
    const err = new NotFoundError();

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Update profile manager', async () => {
    sandbox.stub(managerRepository, 'get').resolves(managerTest);
    sandbox.stub(managerRepository, 'update').resolves(true);

    const result = await updateProfileManagerHandler.handle(randomUUID(), param);
    expect(result.data).to.eq(true);
  });
});
