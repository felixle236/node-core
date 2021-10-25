/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { CheckEmailExistHandler } from './CheckEmailExistHandler';

describe('User usecases - Check email exist', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let clientRepository: IClientRepository;
    let checkEmailExistHandler: CheckEmailExistHandler;

    before(() => {
        Container.set('manager.repository', {
            checkEmailExist() {}
        });
        Container.set('client.repository', {
            checkEmailExist() {}
        });

        managerRepository = Container.get<IManagerRepository>('manager.repository');
        clientRepository = Container.get<IClientRepository>('client.repository');
        checkEmailExistHandler = Container.get(CheckEmailExistHandler);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Check email exist - Manager\'s email is exist', async () => {
        sandbox.stub(managerRepository, 'checkEmailExist').resolves(true);

        const result = await checkEmailExistHandler.handle('manager.test@localhost.com');
        expect(result.data).to.eq(true);
    });

    it('Check email exist - Client\'s email is exist', async () => {
        sandbox.stub(managerRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(clientRepository, 'checkEmailExist').resolves(true);

        const result = await checkEmailExistHandler.handle('client.test@localhost.com');
        expect(result.data).to.eq(true);
    });

    it('Check email exist - Email does not exist', async () => {
        sandbox.stub(managerRepository, 'checkEmailExist').resolves(false);
        sandbox.stub(clientRepository, 'checkEmailExist').resolves(false);

        const result = await checkEmailExistHandler.handle('user.test@localhost.com');
        expect(result.data).to.eq(false);
    });
});
