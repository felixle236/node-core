/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
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
import { v4 } from 'uuid';
import { GetClientByIdQueryHandler } from './GetClientByIdQueryHandler';

describe('Client usecases - Get client by id', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let getClientByIdQueryHandler: GetClientByIdQueryHandler;
    let clientTest: Client;

    before(() => {
        Container.set('client.repository', {
            getById() {}
        });
        Container.set('storage.service', mockStorageService());

        clientRepository = Container.get<IClientRepository>('client.repository');
        getClientByIdQueryHandler = Container.get(GetClientByIdQueryHandler);
    });

    beforeEach(() => {
        clientTest = new Client({
            id: v4(),
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

    it('Get client by id with not found error', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(null);

        const error = await getClientByIdQueryHandler.handle(clientTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get client by id', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);

        const result = await getClientByIdQueryHandler.handle(clientTest.id);
        expect(result.data.id).to.eq(clientTest.id);
    });
});
