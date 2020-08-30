import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { IUserOnlineStatusRepository } from '../../../../gateways/repositories/IUserOnlineStatusRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateUserOnlineStatusCommand } from './UpdateUserOnlineStatusCommand';
import { UpdateUserOnlineStatusCommandHandler } from './UpdateUserOnlineStatusCommandHandler';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('user.online.status.repository', {
    async addUserOnlineStatus() {},
    async removeUserOnlineStatus() {}
});
const userOnlineStatusRepository = Container.get<IUserOnlineStatusRepository>('user.online.status.repository');
const updateUserOnlineStatusCommandHandler = Container.get(UpdateUserOnlineStatusCommandHandler);

describe('User - Update user online status', () => {
    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('Update user online status without id', async () => {
        const param = new UpdateUserOnlineStatusCommand();

        const result = await updateUserOnlineStatusCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Update user online status with offline status', async () => {
        sandbox.stub(userOnlineStatusRepository, 'removeUserOnlineStatus').resolves(true);
        const param = new UpdateUserOnlineStatusCommand();
        param.id = uuid.v4();
        param.isOnline = false;

        const hasSucceed = await updateUserOnlineStatusCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });

    it('Update user online status with online status', async () => {
        sandbox.stub(userOnlineStatusRepository, 'addUserOnlineStatus').resolves(true);
        const param = new UpdateUserOnlineStatusCommand();
        param.id = uuid.v4();
        param.isOnline = true;

        const hasSucceed = await updateUserOnlineStatusCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
