/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from '@domain/entities/user/Manager';
import { IManager } from '@domain/interfaces/user/IManager';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { DeleteManagerHandler } from './DeleteManagerHandler';

describe('Manager usecases - Delete manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let deleteManagerHandler: DeleteManagerHandler;
    let managerTest: Manager;

    before(() => {
        Container.set('manager.repository', {
            get() {},
            softDelete() {}
        });

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        deleteManagerHandler = Container.get(DeleteManagerHandler);
    });

    beforeEach(() => {
        managerTest = new Manager({ id: randomUUID() } as IManager);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Delete manager with data not found error', async () => {
        sandbox.stub(managerRepository, 'get').resolves(null);
        const error = await deleteManagerHandler.handle(managerTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Delete manager', async () => {
        sandbox.stub(managerRepository, 'get').resolves(managerTest);
        sandbox.stub(managerRepository, 'softDelete').resolves(true);

        const result = await deleteManagerHandler.handle(managerTest.id);
        expect(result.data).to.eq(true);
    });
});
