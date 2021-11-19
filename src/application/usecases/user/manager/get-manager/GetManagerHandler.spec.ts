import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from 'domain/entities/user/Manager';
import { GenderType } from 'domain/enums/user/GenderType';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { expect } from 'chai';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { GetManagerHandler } from './GetManagerHandler';

describe('Manager usecases - Get manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let getManagerHandler: GetManagerHandler;
    let managerTest: Manager;

    before(() => {
        managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
        getManagerHandler = new GetManagerHandler(managerRepository);
    });

    beforeEach(() => {
        managerTest = new Manager();
        managerTest.id = randomUUID();
        managerTest.createdAt = new Date();
        managerTest.firstName = 'Manager';
        managerTest.lastName = 'Test';
        managerTest.email = 'manager.test@localhost.com';
        managerTest.avatar = 'avatar.png';
        managerTest.gender = GenderType.Female;
        managerTest.birthday = '2000-06-08';
        managerTest.archivedAt = new Date();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Get manager with not found error', async () => {
        sandbox.stub(managerRepository, 'get').resolves();

        const error = await getManagerHandler.handle(managerTest.id).catch(error => error);
        const err = new NotFoundError();

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get manager', async () => {
        sandbox.stub(managerRepository, 'get').resolves(managerTest);

        const result = await getManagerHandler.handle(managerTest.id);
        expect(result.data.id).to.eq(managerTest.id);
    });
});
