/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from '@domain/entities/user/Manager';
import { GenderType } from '@domain/enums/user/GenderType';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UpdateManagerHandler } from './UpdateManagerHandler';
import { UpdateManagerInput } from './UpdateManagerInput';

describe('Manager usecases - Update manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let updateManagerHandler: UpdateManagerHandler;
    let managerTest: Manager;
    let param: UpdateManagerInput;

    before(() => {
        Container.set('manager.repository', {
            get() {},
            update() {}
        });

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        updateManagerHandler = Container.get(UpdateManagerHandler);
    });

    beforeEach(() => {
        managerTest = new Manager();

        param = new UpdateManagerInput();
        param.firstName = 'Manager';
        param.lastName = 'Test';
        param.gender = GenderType.Female;
        param.birthday = '2000-06-08';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Update manager with data not found error', async () => {
        sandbox.stub(managerRepository, 'get').resolves(null);
        const error = await updateManagerHandler.handle(randomUUID(), param).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update manager', async () => {
        sandbox.stub(managerRepository, 'get').resolves(managerTest);
        sandbox.stub(managerRepository, 'update').resolves(true);

        const result = await updateManagerHandler.handle(randomUUID(), param);
        expect(result.data).to.eq(true);
    });
});
