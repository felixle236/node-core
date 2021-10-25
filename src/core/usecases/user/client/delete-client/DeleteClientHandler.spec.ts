/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { IClient } from '@domain/interfaces/user/IClient';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { DeleteClientHandler } from './DeleteClientHandler';

describe('Client usecases - Delete client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let deleteClientHandler: DeleteClientHandler;
    let clientTest: Client;

    before(() => {
        Container.set('client.repository', {
            get() {},
            softDelete() {}
        });

        clientRepository = Container.get<IClientRepository>('client.repository');
        deleteClientHandler = Container.get(DeleteClientHandler);
    });

    beforeEach(() => {
        clientTest = new Client({ id: randomUUID() } as IClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Delete client with data not found error', async () => {
        sandbox.stub(clientRepository, 'get').resolves(null);
        const error = await deleteClientHandler.handle(clientTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

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
