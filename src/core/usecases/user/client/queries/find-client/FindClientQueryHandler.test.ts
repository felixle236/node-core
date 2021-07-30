/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { GenderType } from '@domain/enums/user/GenderType';
import { IClient } from '@domain/interfaces/user/IClient';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { mockStorageService } from '@shared/test/MockStorageService';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { FindClientQueryHandler } from './FindClientQueryHandler';
import { FindClientQueryInput } from './FindClientQueryInput';

Container.set('client.repository', {
    findAndCount() {}
});
Container.set('storage.service', mockStorageService);
const clientRepository = Container.get<IClientRepository>('client.repository');
const findClientQueryHandler = Container.get(FindClientQueryHandler);

describe('Client - Find client', () => {
    const sandbox = createSandbox();
    let list: Client[];

    beforeEach(() => {
        const client = new Client({
            id: v4(),
            firstName: 'Client',
            lastName: 'Test',
            email: 'client.test@localhost.com',
            avatar: 'avatar.png',
            gender: GenderType.FEMALE,
            birthday: '2000-06-08',
            phone: '0123456789',
            address: '123 Abc',
            locale: 'vi-VN'
        } as IClient);

        list = [
            client,
            client
        ];
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Find client', async () => {
        sandbox.stub(clientRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindClientQueryInput();

        const result = await findClientQueryHandler.handle(param);
        expect(result.data.length).to.eq(2);
        expect(result.pagination.total).to.eq(10);
    });

    it('Find client with params', async () => {
        sandbox.stub(clientRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindClientQueryInput();
        param.keyword = 'test';
        param.status = ClientStatus.ACTIVED;
        param.skip = 10;
        param.limit = 2;

        const result = await findClientQueryHandler.handle(param);
        expect(result.data.length).to.eq(2);
        expect(result.pagination.total).to.eq(10);
    });
});
