/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from '@domain/entities/user/Manager';
import { GenderType } from '@domain/enums/user/GenderType';
import { IManager } from '@domain/interfaces/user/IManager';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockStorageService } from '@shared/test/MockStorageService';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { GetManagerByIdQueryHandler } from './GetManagerByIdQueryHandler';

describe('Manager usecases - Get manager by id', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let getManagerByIdQueryHandler: GetManagerByIdQueryHandler;
    let managerTest: Manager;

    before(() => {
        Container.set('manager.repository', {
            getById() {}
        });
        Container.set('storage.service', mockStorageService());

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        getManagerByIdQueryHandler = Container.get(GetManagerByIdQueryHandler);
    });

    beforeEach(() => {
        managerTest = new Manager({
            id: randomUUID(),
            createdAt: new Date(),
            firstName: 'Manager',
            lastName: 'Test',
            email: 'manager.test@localhost.com',
            avatar: 'avatar.png',
            gender: GenderType.Female,
            birthday: '2000-06-08',
            archivedAt: new Date()
        } as IManager);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Get manager by id with not found error', async () => {
        sandbox.stub(managerRepository, 'getById').resolves(null);

        const error = await getManagerByIdQueryHandler.handle(managerTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get manager by id', async () => {
        sandbox.stub(managerRepository, 'getById').resolves(managerTest);

        const result = await getManagerByIdQueryHandler.handle(managerTest.id);
        expect(result.data.id).to.eq(managerTest.id);
    });
});
