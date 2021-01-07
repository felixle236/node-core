import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { GetListOnlineStatusByIdsQuery } from './GetListOnlineStatusByIdsQuery';
import { GetListOnlineStatusByIdsQueryHandler } from './GetListOnlineStatusByIdsQueryHandler';
import { IUserOnlineStatusRepository } from '../../../../gateways/repositories/user/IUserOnlineStatusRepository';

Container.set('user.online.status.repository', {
    async getListOnlineStatusByIds() {}
});
const userOnlineStatusRepository = Container.get<IUserOnlineStatusRepository>('user.online.status.repository');
const getListOnlineStatusByIdsQueryHandler = Container.get(GetListOnlineStatusByIdsQueryHandler);

describe('User - Get list online status by ids', () => {
    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('Get list online status by ids without param', async () => {
        sandbox.stub(userOnlineStatusRepository, 'getListOnlineStatusByIds').resolves([]);
        const param = new GetListOnlineStatusByIdsQuery();

        const list = await getListOnlineStatusByIdsQueryHandler.handle(param);
        expect(list.length).to.eq(0);
    });

    it('Get list online status by ids with online list', async () => {
        const id = uuid.v4();
        const id2 = uuid.v4();
        sandbox.stub(userOnlineStatusRepository, 'getListOnlineStatusByIds').resolves([id, id2]);
        const param = new GetListOnlineStatusByIdsQuery();
        param.ids = [id, id2];

        const list = await getListOnlineStatusByIdsQueryHandler.handle(param);
        expect(list.filter(item => item.isOnline).length).to.eq(2);
    });

    it('Get list online status by ids with offline list', async () => {
        const id = uuid.v4();
        const id2 = uuid.v4();
        sandbox.stub(userOnlineStatusRepository, 'getListOnlineStatusByIds').resolves([]);
        const param = new GetListOnlineStatusByIdsQuery();
        param.ids = [id, id2];

        const list = await getListOnlineStatusByIdsQueryHandler.handle(param);
        expect(list.filter(item => !item.isOnline).length).to.eq(2);
    });
});
