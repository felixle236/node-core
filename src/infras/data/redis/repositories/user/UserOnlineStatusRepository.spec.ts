/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import { IRedisContext } from '@shared/database/interfaces/IRedisContext';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { UserOnlineStatusRepository } from './UserOnlineStatusRepository';

describe('Authorization JWT service', () => {
    const sandbox = createSandbox();
    let redisContext: IRedisContext;
    let userOnlineStatusRepository: UserOnlineStatusRepository;

    before(() => {
        Container.set('redis.context', {
            redisClient: {
                hmgetAsync() {},
                hmsetAsync() {},
                setAsync() {}
            }
        });

        redisContext = Container.get<IRedisContext>('redis.context');
        userOnlineStatusRepository = Container.get(UserOnlineStatusRepository);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Get list online status by ids', async () => {
        const data = {
            userId: v4(),
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
            userId: v4(),
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
