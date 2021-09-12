/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { GenderType } from '@domain/enums/user/GenderType';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UpdateMyProfileClientCommandHandler } from './UpdateMyProfileClientCommandHandler';
import { UpdateMyProfileClientCommandInput } from './UpdateMyProfileClientCommandInput';

describe('Client usecases - Update my profile client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let updateMyProfileClientCommandHandler: UpdateMyProfileClientCommandHandler;
    let clientTest: Client;
    let param: UpdateMyProfileClientCommandInput;

    before(() => {
        Container.set('client.repository', {
            getById() {},
            update() {}
        });

        clientRepository = Container.get<IClientRepository>('client.repository');
        updateMyProfileClientCommandHandler = Container.get(UpdateMyProfileClientCommandHandler);
    });

    beforeEach(() => {
        clientTest = new Client();

        param = new UpdateMyProfileClientCommandInput();
        param.firstName = 'Client';
        param.lastName = 'Test';
        param.gender = GenderType.Female;
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

    it('Update my profile client with data not found error', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(null);
        const error = await updateMyProfileClientCommandHandler.handle(randomUUID(), param).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update my profile client', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(clientTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const result = await updateMyProfileClientCommandHandler.handle(randomUUID(), param);
        expect(result.data).to.eq(true);
    });
});
