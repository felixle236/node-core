import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { IUserOnlineStatusRepository } from 'application/interfaces/repositories/user/IUserOnlineStatusRepository';
import { expect } from 'chai';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { GetListOnlineStatusByIdsHandler } from './GetListOnlineStatusByIdsHandler';
import { GetListOnlineStatusByIdsInput } from './GetListOnlineStatusByIdsSchema';

describe('User usecases - Get list online status by ids', () => {
  const sandbox = createSandbox();
  let userOnlineStatusRepository: IUserOnlineStatusRepository;
  let getListOnlineStatusByIdsHandler: GetListOnlineStatusByIdsHandler;

  before(() => {
    userOnlineStatusRepository = mockRepositoryInjection<IUserOnlineStatusRepository>(InjectRepository.UserOnlineStatus, ['getListOnlineStatusByIds']);
    getListOnlineStatusByIdsHandler = new GetListOnlineStatusByIdsHandler(userOnlineStatusRepository);
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    Container.reset();
  });

  it('Get list online status with id is not uuid', async () => {
    const param = new GetListOnlineStatusByIdsInput();
    param.ids = ['a'];

    const error: LogicalError = await getListOnlineStatusByIdsHandler.handle(param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_INVALID, 'ids');

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Get list online status by ids', async () => {
    const list: { id: string; isOnline: boolean; onlineAt?: Date }[] = [
      {
        id: randomUUID(),
        isOnline: true,
        onlineAt: new Date(),
      },
      {
        id: randomUUID(),
        isOnline: false,
        onlineAt: new Date(),
      },
    ];
    sandbox.stub(userOnlineStatusRepository, 'getListOnlineStatusByIds').resolves(list.map((item) => JSON.stringify(item)));

    const param = new GetListOnlineStatusByIdsInput();
    param.ids = [randomUUID(), randomUUID()];

    const result = await getListOnlineStatusByIdsHandler.handle(param);
    expect(result.data[0].id).to.eq(param.ids[0]);
    expect(result.data[1].id).to.eq(param.ids[1]);
  });
});
