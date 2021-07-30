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
import { GetMyProfileClientQueryHandler } from './GetMyProfileClientQueryHandler';

Container.set('client.repository', {
    getById() {}
});
Container.set('storage.service', mockStorageService);
const clientRepository = Container.get<IClientRepository>('client.repository');
const getMyProfileClientQueryHandler = Container.get(GetMyProfileClientQueryHandler);

describe('Client - Get client by id', () => {
    const sandbox = createSandbox();
    let dataTest: Client;

    beforeEach(() => {
        dataTest = new Client({
            id: v4(),
            firstName: 'Client',
            lastName: 'Test',
            email: 'client.test@localhost.com',
            avatar: 'avatar.png',
            gender: GenderType.FEMALE,
            birthday: '2000-06-08',
            phone: '0123456789',
            address: '123 Abc',
            locale: 'vi-VN',
            activedAt: new Date(),
            archivedAt: new Date()
        } as IClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Get client by id with not found error', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(null);

        const error = await getMyProfileClientQueryHandler.handle(dataTest.id).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get client by id', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(dataTest);

        const result = await getMyProfileClientQueryHandler.handle(dataTest.id);
        expect(result.data.id).to.eq(dataTest.id);
    });
});
