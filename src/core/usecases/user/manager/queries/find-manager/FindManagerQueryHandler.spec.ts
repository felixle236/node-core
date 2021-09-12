/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from '@domain/entities/user/Manager';
import { GenderType } from '@domain/enums/user/GenderType';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IManager } from '@domain/interfaces/user/IManager';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { mockStorageService } from '@shared/test/MockStorageService';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { FindManagerQueryHandler } from './FindManagerQueryHandler';
import { FindManagerQueryInput } from './FindManagerQueryInput';

describe('Manager usecases - Find manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let findManagerQueryHandler: FindManagerQueryHandler;
    let list: Manager[];

    before(() => {
        Container.set('manager.repository', {
            findAndCount() {}
        });
        Container.set('storage.service', mockStorageService());

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        findManagerQueryHandler = Container.get(FindManagerQueryHandler);
    });

    beforeEach(() => {
        const manager = new Manager({
            id: randomUUID(),
            createdAt: new Date(),
            firstName: 'Manager',
            lastName: 'Test',
            email: 'manager.test@localhost.com',
            avatar: 'avatar.png',
            gender: GenderType.Female,
            birthday: '2000-06-08'
        } as IManager);

        list = [
            manager,
            manager
        ];
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Find manager', async () => {
        sandbox.stub(managerRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindManagerQueryInput();

        const result = await findManagerQueryHandler.handle(param);
        expect(result.data.length).to.eq(2);
        expect(result.pagination.total).to.eq(10);
    });

    it('Find manager with params', async () => {
        sandbox.stub(managerRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindManagerQueryInput();
        param.keyword = 'test';
        param.status = ManagerStatus.Actived;
        param.skip = 10;
        param.limit = 2;

        const result = await findManagerQueryHandler.handle(param);
        expect(result.data.length).to.eq(2);
        expect(result.pagination.total).to.eq(10);
    });
});
