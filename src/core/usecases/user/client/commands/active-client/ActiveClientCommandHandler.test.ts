/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClient } from '@domain/interfaces/user/IClient';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { addSeconds } from '@libs/date';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { ActiveClientCommandHandler } from './ActiveClientCommandHandler';
import { ActiveClientCommandInput } from './ActiveClientCommandInput';

Container.set('client.repository', {
    getByEmail() {},
    update() {}
});
const clientRepository = Container.get<IClientRepository>('client.repository');
const activeClientCommandHandler = Container.get(ActiveClientCommandHandler);

describe('Client - Active client', () => {
    const sandbox = createSandbox();
    let dataTest: Client;

    beforeEach(() => {
        dataTest = new Client({ id: v4() } as IClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Active client with params missing error', async () => {
        const param = new ActiveClientCommandInput();
        const error = await activeClientCommandHandler.handle(param).catch(error => error);
        expect(error.code).to.eq('VALIDATION_ERR');
        expect(error.fields.map(field => field.name)).to.have.members(['email', 'activeKey']);
    });

    it('Active client with params invalid error - Email not exist', async () => {
        sandbox.stub(clientRepository, 'getByEmail').resolves(null);

        const param = new ActiveClientCommandInput();
        param.email = 'test@localhost.com';
        param.activeKey = 'test';

        const error = await activeClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.DATA_INVALID);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Active client with params invalid error - Active key not matched', async () => {
        sandbox.stub(clientRepository, 'getByEmail').resolves(dataTest);

        const param = new ActiveClientCommandInput();
        param.email = 'test@localhost.com';
        param.activeKey = 'test';

        const error = await activeClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.DATA_INVALID);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Active client with params invalid error - Account is actived already', async () => {
        dataTest.activeKey = 'test';
        dataTest.status = ClientStatus.ACTIVED;
        sandbox.stub(clientRepository, 'getByEmail').resolves(dataTest);

        const param = new ActiveClientCommandInput();
        param.email = 'test@localhost.com';
        param.activeKey = 'test';

        const error = await activeClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.DATA_INVALID);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Active client with active key expired error', async () => {
        dataTest.activeKey = 'test';
        dataTest.activeExpire = addSeconds(new Date(), -1);
        sandbox.stub(clientRepository, 'getByEmail').resolves(dataTest);

        const param = new ActiveClientCommandInput();
        param.email = 'test@localhost.com';
        param.activeKey = 'test';

        const error = await activeClientCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXPIRED, 'activation key');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Active client', async () => {
        dataTest.activeKey = 'test';
        dataTest.activeExpire = addSeconds(new Date(), 1);
        sandbox.stub(clientRepository, 'getByEmail').resolves(dataTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const param = new ActiveClientCommandInput();
        param.email = 'test@localhost.com';
        param.activeKey = 'test';

        const result = await activeClientCommandHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
