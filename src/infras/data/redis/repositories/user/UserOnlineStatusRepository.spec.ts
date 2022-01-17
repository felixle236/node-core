import 'reflect-metadata';
import { randomUUID } from 'crypto';
import { IUserOnlineStatusRepository } from 'application/interfaces/repositories/user/IUserOnlineStatusRepository';
import { expect } from 'chai';
import { RedisClientType } from 'redis';
import { mockRedisContext } from 'shared/test/MockRedisContext';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UserOnlineStatusRepository } from './UserOnlineStatusRepository';
import { RedisContext } from '../../RedisContext';

describe('User online status repository', () => {
  const sandbox = createSandbox();
  let redisClient: RedisClientType<Record<string, never>, Record<string, never>>;
  let redisContext: RedisContext;
  let userOnlineStatusRepository: IUserOnlineStatusRepository;

  before(() => {
    redisContext = mockRedisContext();
    redisClient = redisContext.getConnection();
    userOnlineStatusRepository = new UserOnlineStatusRepository(redisContext);
  });

  afterEach(async () => {
    sandbox.restore();
    await redisClient.FLUSHALL();
  });

  after(async () => {
    Container.reset();
    await redisClient.disconnect();
  });

  it('Get list online status by ids', async () => {
    const data = {
      userId: randomUUID(),
      isOnline: true,
    };
    const str = JSON.stringify(data, undefined, 2);
    sandbox.stub(redisClient, 'HMGET').resolves([str]);

    const arr = await userOnlineStatusRepository.getListOnlineStatusByIds([data.userId]);
    const result = JSON.parse(arr[0]);

    expect(result.userId).to.eq(data.userId);
    expect(result.isOnline).to.eq(data.isOnline);
  });

  it('Update user online status', async () => {
    const data = {
      userId: randomUUID(),
      isOnline: true,
    };
    sandbox.stub(redisClient, 'HSET').resolves(1);

    const isSucceed = await userOnlineStatusRepository.updateUserOnlineStatus(data.userId, JSON.stringify(data, undefined, 2));
    expect(isSucceed).to.eq(true);
  });

  it('Demo add key with expire time', async () => {
    sandbox.stub(redisClient, 'SET').resolves('OK');

    const isSucceed = await userOnlineStatusRepository.demoAddKeyWithExpireTime('id', 'data', 10);
    expect(isSucceed).to.eq(true);
  });
});
