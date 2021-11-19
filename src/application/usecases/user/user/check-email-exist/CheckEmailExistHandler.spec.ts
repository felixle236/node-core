import 'reflect-metadata';
import 'mocha';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { expect } from 'chai';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { CheckEmailExistHandler } from './CheckEmailExistHandler';

describe('User usecases - Check email exist', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let clientRepository: IClientRepository;
    let checkEmailExistHandler: CheckEmailExistHandler;

    before(() => {
        clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client, ['checkEmailExist']);
        managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager, ['checkEmailExist']);
        checkEmailExistHandler = new CheckEmailExistHandler(managerRepository, clientRepository);
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
