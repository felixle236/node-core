/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Client } from '@domain/entities/user/Client';
import { GenderType } from '@domain/enums/user/GenderType';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { UpdateClientCommandHandler } from './UpdateClientCommandHandler';
import { UpdateClientCommandInput } from './UpdateClientCommandInput';

describe('Client usecases - Update client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let updateClientCommandHandler: UpdateClientCommandHandler;
    let clientTest: Client;
    let param: UpdateClientCommandInput;

    before(() => {
        Container.set('client.repository', {
            getById() {},
            update() {}
        });

        clientRepository = Container.get<IClientRepository>('client.repository');
        updateClientCommandHandler = Container.get(UpdateClientCommandHandler);
    });

    beforeEach(() => {
        clientTest = new Client();

        param = new UpdateClientCommandInput();
        param.firstName = 'Client';
        param.lastName = 'Test';
        param.gender = GenderType.FEMALE;
        param.birthday = '1970-01-01';
        param.phone = '0123456789';
        param.address = '123 Abc';
        param.locale = 'en-US';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Update client with data not found error', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(null);
        const error = await updateClientCommandHandler.handle(v4(), param).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update client', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const result = await updateClientCommandHandler.handle(v4(), param);
        expect(result.data).to.eq(true);
    });
});
