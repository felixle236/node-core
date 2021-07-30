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
import { ArchiveClientCommandHandler } from './ArchiveClientCommandHandler';

Container.set('client.repository', {
    getById() {},
    update() {}
});
const clientRepository = Container.get<IClientRepository>('client.repository');
const archiveClientCommandHandler = Container.get(ArchiveClientCommandHandler);

describe('Client - Archive client', () => {
    const sandbox = createSandbox();
    let dataTest: Client;

    beforeEach(() => {
        dataTest = new Client({ id: v4() } as IClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Archive client with data not found error', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(null);
        const error = await archiveClientCommandHandler.handle(dataTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Archive client', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(dataTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const result = await archiveClientCommandHandler.handle(dataTest.id);
        expect(result.data).to.eq(true);
    });
});
