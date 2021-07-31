/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Manager } from '@domain/entities/user/Manager';
import { GenderType } from '@domain/enums/user/GenderType';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { UpdateManagerCommandHandler } from './UpdateManagerCommandHandler';
import { UpdateManagerCommandInput } from './UpdateManagerCommandInput';

describe('Manager - Update manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let updateManagerCommandHandler: UpdateManagerCommandHandler;
    let managerTest: Manager;
    let param: UpdateManagerCommandInput;

    before(() => {
        Container.set('manager.repository', {
            getById() {},
            update() {}
        });

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        updateManagerCommandHandler = Container.get(UpdateManagerCommandHandler);
    });

    beforeEach(() => {
        managerTest = new Manager();

        param = new UpdateManagerCommandInput();
        param.firstName = 'Manager';
        param.lastName = 'Test';
        param.gender = GenderType.FEMALE;
        param.birthday = '2000-06-08';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Update manager with data not found error', async () => {
        sandbox.stub(managerRepository, 'getById').resolves(null);
        const error = await updateManagerCommandHandler.handle(v4(), param).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update manager', async () => {
        sandbox.stub(managerRepository, 'getById').resolves(managerTest);
        sandbox.stub(managerRepository, 'update').resolves(true);

        const result = await updateManagerCommandHandler.handle(v4(), param);
        expect(result.data).to.eq(true);
    });
});
