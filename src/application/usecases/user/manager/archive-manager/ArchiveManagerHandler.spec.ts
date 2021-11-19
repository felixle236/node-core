import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from 'domain/entities/user/Manager';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { expect } from 'chai';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ArchiveManagerHandler } from './ArchiveManagerHandler';

describe('Manager usecases - Archive manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let archiveManagerHandler: ArchiveManagerHandler;
    let managerTest: Manager;

    before(() => {
        managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
        archiveManagerHandler = new ArchiveManagerHandler(managerRepository);
    });

    beforeEach(() => {
        managerTest = new Manager();
        managerTest.id = randomUUID();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Archive manager with data not found error', async () => {
        sandbox.stub(managerRepository, 'get').resolves();
        const error = await archiveManagerHandler.handle(managerTest.id).catch(error => error);
        const err = new NotFoundError();

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Archive manager', async () => {
        sandbox.stub(managerRepository, 'get').resolves(managerTest);
        sandbox.stub(managerRepository, 'update').resolves(true);

        const result = await archiveManagerHandler.handle(managerTest.id);
        expect(result.data).to.eq(true);
    });
});
