import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Manager } from 'domain/entities/user/Manager';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { expect } from 'chai';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockDbContext } from 'shared/test/MockDbContext';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { DeleteManagerHandler } from './DeleteManagerHandler';

describe('Manager usecases - Delete manager', () => {
    const sandbox = createSandbox();
    let dbContext: IDbContext;
    let managerRepository: IManagerRepository;
    let authRepository: IAuthRepository;
    let deleteManagerHandler: DeleteManagerHandler;
    let managerTest: Manager;

    before(async () => {
        dbContext = await mockDbContext();
        authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getAllByUser']);
        managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
        deleteManagerHandler = new DeleteManagerHandler(dbContext, managerRepository, authRepository);
    });

    beforeEach(() => {
        managerTest = new Manager();
        managerTest.id = randomUUID();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(async () => {
        Container.reset();
        await dbContext.destroyConnection();
    });

    it('Delete manager with data not found error', async () => {
        sandbox.stub(managerRepository, 'get').resolves();
        const error = await deleteManagerHandler.handle(managerTest.id).catch(error => error);
        const err = new NotFoundError();

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Delete manager', async () => {
        sandbox.stub(managerRepository, 'get').resolves(managerTest);
        sandbox.stub(managerRepository, 'softDelete').resolves(true);
        sandbox.stub(authRepository, 'getAllByUser').resolves([{ id: randomUUID() } as Auth]);
        sandbox.stub(authRepository, 'softDelete').resolves(true);

        const result = await deleteManagerHandler.handle(managerTest.id);
        expect(result.data).to.eq(true);
    });
});
