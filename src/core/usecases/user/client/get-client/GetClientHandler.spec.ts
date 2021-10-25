/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { GenderType } from '@domain/enums/user/GenderType';
import { IClient } from '@domain/interfaces/user/IClient';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockStorageService } from '@shared/test/MockStorageService';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { GetClientHandler } from './GetClientHandler';

describe('Client usecases - Get client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let getClientHandler: GetClientHandler;
    let clientTest: Client;

    before(() => {
        Container.set('client.repository', {
            get() {}
        });
        Container.set('storage.service', mockStorageService());

        clientRepository = Container.get<IClientRepository>('client.repository');
        getClientHandler = Container.get(GetClientHandler);
    });

    beforeEach(() => {
        clientTest = new Client({
            id: randomUUID(),
            firstName: 'Client',
            lastName: 'Test',
            email: 'client.test@localhost.com',
            avatar: 'avatar.png',
            gender: GenderType.Female,
            birthday: '1970-01-01',
            phone: '0123456789',
            address: '123 Abc',
            locale: 'en-US',
            activedAt: new Date(),
            archivedAt: new Date()
        } as IClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Get client with not found error', async () => {
        sandbox.stub(clientRepository, 'get').resolves(null);

        const error = await getClientHandler.handle(clientTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get client', async () => {
        sandbox.stub(clientRepository, 'get').resolves(clientTest);

        const result = await getClientHandler.handle(clientTest.id);
        expect(result.data.id).to.eq(clientTest.id);
    });
});
