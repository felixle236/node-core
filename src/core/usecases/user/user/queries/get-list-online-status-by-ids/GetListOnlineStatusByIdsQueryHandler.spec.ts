/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { IUserOnlineStatusRepository } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { GetListOnlineStatusByIdsQueryHandler } from './GetListOnlineStatusByIdsQueryHandler';
import { GetListOnlineStatusByIdsQueryInput } from './GetListOnlineStatusByIdsQueryInput';

describe('User usecases - Get list online status by ids', () => {
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

    it('Get list online status with id is not uuid', async () => {
        const param = new GetListOnlineStatusByIdsQueryInput();
        param.ids = ['a'];

        const error: SystemError = await getListOnlineStatusByIdsQueryHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_INVALID, 'ids');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get list online status by ids', async () => {
        const list: {id: string, isOnline: boolean, onlineAt: Date | null}[] = [{
            id: v4(),
            isOnline: true,
            onlineAt: new Date()
        }, {
            id: v4(),
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
