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
import { UpdateMyProfileClientCommandHandler } from './UpdateMyProfileClientCommandHandler';
import { UpdateMyProfileClientCommandInput } from './UpdateMyProfileClientCommandInput';

Container.set('client.repository', {
    getById() {},
    update() {}
});
const clientRepository = Container.get<IClientRepository>('client.repository');
const updateMyProfileClientCommandHandler = Container.get(UpdateMyProfileClientCommandHandler);

describe('Client - Update client', () => {
    const sandbox = createSandbox();
    let dataTest: Client;
    let param: UpdateMyProfileClientCommandInput;

    beforeEach(() => {
        dataTest = new Client();

        param = new UpdateMyProfileClientCommandInput();
        param.firstName = 'Client';
        param.lastName = 'Test';
        param.gender = GenderType.FEMALE;
        param.birthday = '2000-06-08';
        param.phone = '0123456789';
        param.address = '123 Abc';
        param.locale = 'vi-VN';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Update client with data not found error', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(null);
        const error = await updateMyProfileClientCommandHandler.handle(v4(), param).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update client', async () => {
        sandbox.stub(clientRepository, 'getById').resolves(dataTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const result = await updateMyProfileClientCommandHandler.handle(v4(), param);
        expect(result.data).to.eq(true);
    });
});
