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

Container.set('client.repository', {
    getById() {},
    softDelete() {}
});
const clientRepository = Container.get<IClientRepository>('client.repository');
const deleteClientCommandHandler = Container.get(DeleteClientCommandHandler);

describe('Client - Delete client', () => {
    const sandbox = createSandbox();
    let dataTest: Client;

    beforeEach(() => {
        dataTest = new Client({ id: v4() } as IClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Delete client with data not found error', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(null);
        const error = await deleteClientCommandHandler.handle(dataTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Delete client', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(dataTest);
        sandbox.stub(clientRepository, 'softDelete').resolves(true);

        const result = await deleteClientCommandHandler.handle(dataTest.id);
        expect(result.data).to.eq(true);
    });
});
