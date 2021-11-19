import 'reflect-metadata';
import { randomUUID } from 'crypto';
import { IUserOnlineStatusRepository } from 'application/interfaces/repositories/user/IUserOnlineStatusRepository';
import { expect } from 'chai';
import { IRedisContext } from 'shared/database/interfaces/IRedisContext';
import { mockInjection } from 'shared/test/MockInjection';
import { mockRedisContext } from 'shared/test/MockRedisContext';
import { InjectDb } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UserOnlineStatusRepository } from './UserOnlineStatusRepository';

describe('Authorization JWT service', () => {
    const sandbox = createSandbox();
    let redisContext: IRedisContext;
    let userOnlineStatusRepository: IUserOnlineStatusRepository;

    before(() => {
        redisContext = mockInjection(InjectDb.RedisContext, mockRedisContext());
        userOnlineStatusRepository = new UserOnlineStatusRepository(redisContext);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Get list online status by ids', async () => {
        const data = {
            userId: randomUUID(),
            isOnline: true
        };
        const str = JSON.stringify(data, undefined, 2);
        sandbox.stub(redisContext.redisClient, 'hmgetAsync').resolves([str]);

        const arr = await userOnlineStatusRepository.getListOnlineStatusByIds([data.userId]);
        const result = JSON.parse(arr[0]);

        expect(result.userId).to.eq(data.userId);
        expect(result.isOnline).to.eq(data.isOnline);
    });

    it('Update user online status', async () => {
        const data = {
            userId: randomUUID(),
            isOnline: true
        };
        sandbox.stub(redisContext.redisClient, 'hmsetAsync').resolves('OK');

        const isSucceed = await userOnlineStatusRepository.updateUserOnlineStatus(data.userId, JSON.stringify(data, undefined, 2));
        expect(isSucceed).to.eq(true);
    });

    it('Demo add key with expire time', async () => {
        sandbox.stub(redisContext.redisClient, 'setAsync').resolves('OK');

        const isSucceed = await userOnlineStatusRepository.demoAddKeyWithExpireTime('id', 'data', 10);
        expect(isSucceed).to.eq(true);
    });
});
