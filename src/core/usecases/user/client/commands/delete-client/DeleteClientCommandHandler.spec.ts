/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Client } from '@domain/entities/user/Client';
import { IClient } from '@domain/interfaces/user/IClient';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { DeleteClientCommandHandler } from './DeleteClientCommandHandler';

describe('Client usecases - Delete client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let deleteClientCommandHandler: DeleteClientCommandHandler;
    let clientTest: Client;

    before(() => {
        Container.set('client.repository', {
            getById() {},
            softDelete() {}
        });

        clientRepository = Container.get<IClientRepository>('client.repository');
        deleteClientCommandHandler = Container.get(DeleteClientCommandHandler);
    });

    beforeEach(() => {
        clientTest = new Client({ id: v4() } as IClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Delete client with data not found error', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(null);
        const error = await deleteClientCommandHandler.handle(clientTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Delete client', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);
        sandbox.stub(clientRepository, 'softDelete').resolves(true);

        const result = await deleteClientCommandHandler.handle(clientTest.id);
        expect(result.data).to.eq(true);
    });
});
