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
import { GetMyProfileManagerHandler } from './GetMyProfileManagerHandler';

describe('Manager usecases - Get my profile manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let getMyProfileManagerHandler: GetMyProfileManagerHandler;
    let managerTest: Manager;

    before(() => {
        Container.set('manager.repository', {
            get() {}
        });
        Container.set('storage.service', mockStorageService());

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        getMyProfileManagerHandler = Container.get(GetMyProfileManagerHandler);
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
            birthday: '2000-06-08'
        } as IManager);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Get my profile manager with not found error', async () => {
        sandbox.stub(managerRepository, 'get').resolves(null);

        const error = await getMyProfileManagerHandler.handle(managerTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get my profile manager', async () => {
        sandbox.stub(managerRepository, 'get').resolves(managerTest);

        const result = await getMyProfileManagerHandler.handle(managerTest.id);
        expect(result.data.id).to.eq(managerTest.id);
    });
});
