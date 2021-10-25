/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { IUserOnlineStatusRepository } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UpdateUserOnlineStatusHandler } from './UpdateUserOnlineStatusHandler';
import { UpdateUserOnlineStatusInput } from './UpdateUserOnlineStatusInput';

describe('User usecases - Update user online status', () => {
    const sandbox = createSandbox();
    let userOnlineStatusRepository: IUserOnlineStatusRepository;
    let updateUserOnlineStatusHandler: UpdateUserOnlineStatusHandler;

    before(() => {
        Container.set('user_online_status.repository', {
            updateUserOnlineStatus() {}
        });

        userOnlineStatusRepository = Container.get<IUserOnlineStatusRepository>('user_online_status.repository');
        updateUserOnlineStatusHandler = Container.get(UpdateUserOnlineStatusHandler);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Update user online status - Online status', async () => {
        sandbox.stub(userOnlineStatusRepository, 'updateUserOnlineStatus').resolves(true);

        const param = new UpdateUserOnlineStatusInput();
        param.isOnline = true;
        param.onlineAt = new Date();

        const result = await updateUserOnlineStatusHandler.handle(randomUUID(), param);
        expect(result.data).to.eq(true);
    });

    it('Update user online status - Offline status', async () => {
        sandbox.stub(userOnlineStatusRepository, 'updateUserOnlineStatus').resolves(true);

        const param = new UpdateUserOnlineStatusInput();
        param.isOnline = false;
        param.onlineAt = new Date();

        const result = await updateUserOnlineStatusHandler.handle(randomUUID(), param);
        expect(result.data).to.eq(true);
    });
});
