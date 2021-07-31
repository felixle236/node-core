/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { IUserOnlineStatusRepository } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { GetListOnlineStatusByIdsQueryHandler } from './GetListOnlineStatusByIdsQueryHandler';
import { GetListOnlineStatusByIdsQueryInput } from './GetListOnlineStatusByIdsQueryInput';

describe('User - Get list online status by ids', () => {
    const sandbox = createSandbox();
    let userOnlineStatusRepository: IUserOnlineStatusRepository;
    let getListOnlineStatusByIdsQueryHandler: GetListOnlineStatusByIdsQueryHandler;

    before(() => {
        Container.set('user_online_status.repository', {
            getListOnlineStatusByIds() {}
        });

        userOnlineStatusRepository = Container.get<IUserOnlineStatusRepository>('user_online_status.repository');
        getListOnlineStatusByIdsQueryHandler = Container.get(GetListOnlineStatusByIdsQueryHandler);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Get list online status by ids', async () => {
        const list: {isOnline: boolean, onlineAt: Date | null}[] = [{
            isOnline: true,
            onlineAt: new Date()
        }, {
            isOnline: false,
            onlineAt: new Date()
        }];
        sandbox.stub(userOnlineStatusRepository, 'getListOnlineStatusByIds').resolves(list.map(item => JSON.stringify(item)));

        const param = new GetListOnlineStatusByIdsQueryInput();
        param.ids = [v4(), v4()];

        const result = await getListOnlineStatusByIdsQueryHandler.handle(param);
        expect(result.data[0].id).to.eq(param.ids[0]);
        expect(result.data[1].id).to.eq(param.ids[1]);
    });
});
