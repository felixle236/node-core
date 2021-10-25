/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { GenderType } from '@domain/enums/user/GenderType';
import { IClient } from '@domain/interfaces/user/IClient';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { mockStorageService } from '@shared/test/MockStorageService';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { FindClientHandler } from './FindClientHandler';
import { FindClientInput } from './FindClientInput';

describe('Client usecases - Find client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let findClientHandler: FindClientHandler;
    let list: Client[];

    before(() => {
        Container.set('client.repository', {
            findAndCount() {}
        });
        Container.set('storage.service', mockStorageService());

        clientRepository = Container.get<IClientRepository>('client.repository');
        findClientHandler = Container.get(FindClientHandler);
    });

    beforeEach(() => {
        const client = new Client({
            id: randomUUID(),
            firstName: 'Client',
            lastName: 'Test',
            email: 'client.test@localhost.com',
            avatar: 'avatar.png',
            gender: GenderType.Female,
            birthday: '1970-01-01',
            phone: '0123456789',
            address: '123 Abc',
            locale: 'en-US'
        } as IClient);

        list = [
            client,
            client
        ];
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Find client', async () => {
        sandbox.stub(clientRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindClientInput();

        const result = await findClientHandler.handle(param);
        expect(result.data.length).to.eq(2);
        expect(result.pagination.total).to.eq(10);
    });

    it('Find client with params', async () => {
        sandbox.stub(clientRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindClientInput();
        param.keyword = 'test';
        param.status = ClientStatus.Actived;
        param.skip = 10;
        param.limit = 2;

        const result = await findClientHandler.handle(param);
        expect(result.data.length).to.eq(2);
        expect(result.pagination.total).to.eq(10);
    });
});
