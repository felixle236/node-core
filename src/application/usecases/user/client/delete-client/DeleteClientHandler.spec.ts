import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Client } from 'domain/entities/user/Client';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { expect } from 'chai';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockDbContext } from 'shared/test/MockDbContext';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { DeleteClientHandler } from './DeleteClientHandler';

describe('Client usecases - Delete client', () => {
    const sandbox = createSandbox();
    let dbContext: IDbContext;
    let clientRepository: IClientRepository;
    let authRepository: IAuthRepository;
    let deleteClientHandler: DeleteClientHandler;
    let clientTest: Client;

    before(async () => {
        dbContext = await mockDbContext();
        authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getAllByUser']);
        clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
        deleteClientHandler = new DeleteClientHandler(dbContext, clientRepository, authRepository);
    });

    beforeEach(() => {
        clientTest = new Client();
        clientTest.id = randomUUID();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(async () => {
        Container.reset();
        await dbContext.destroyConnection();
    });

    it('Delete client with data not found error', async () => {
        sandbox.stub(clientRepository, 'get').resolves();
        const error = await deleteClientHandler.handle(clientTest.id).catch(error => error);
        const err = new NotFoundError();

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Delete client', async () => {
        sandbox.stub(clientRepository, 'get').resolves(clientTest);
        sandbox.stub(clientRepository, 'softDelete').resolves(true);
        sandbox.stub(authRepository, 'getAllByUser').resolves([{ id: randomUUID() } as Auth]);
        sandbox.stub(authRepository, 'softDelete').resolves(true);

        const result = await deleteClientHandler.handle(clientTest.id);
        expect(result.data).to.eq(true);
    });
});
