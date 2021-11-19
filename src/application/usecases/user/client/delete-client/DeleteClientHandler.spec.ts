import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Client } from 'domain/entities/user/Client';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { expect } from 'chai';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { DeleteClientHandler } from './DeleteClientHandler';

describe('Client usecases - Delete client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let deleteClientHandler: DeleteClientHandler;
    let clientTest: Client;

    before(() => {
        clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
        deleteClientHandler = new DeleteClientHandler(clientRepository);
    });

    beforeEach(() => {
        clientTest = new Client();
        clientTest.id = randomUUID();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
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

        const result = await deleteClientHandler.handle(clientTest.id);
        expect(result.data).to.eq(true);
    });
});
