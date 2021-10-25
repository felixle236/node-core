/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import crypto, { randomUUID } from 'crypto';
import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { IClient } from '@domain/interfaces/user/IClient';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { addSeconds } from '@utils/datetime';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ActiveClientHandler } from './ActiveClientHandler';
import { ActiveClientInput } from './ActiveClientInput';

describe('Client usecases - Active client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let activeClientHandler: ActiveClientHandler;
    let clientTest: Client;

    before(() => {
        Container.set('client.repository', {
            getByEmail() {},
            update() {}
        });

        clientRepository = Container.get<IClientRepository>('client.repository');
        activeClientHandler = Container.get(ActiveClientHandler);
    });

    beforeEach(() => {
        clientTest = new Client({ id: randomUUID() } as IClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Active client with params invalid error - Email not exist', async () => {
        sandbox.stub(clientRepository, 'getByEmail').resolves(null);

        const param = new ActiveClientInput();
        param.email = 'test@localhost.com';
        param.activeKey = crypto.randomBytes(32).toString('hex');

        const error = await activeClientHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.DATA_INVALID);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Active client with params invalid error - Active key not matched', async () => {
        sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);

        const param = new ActiveClientInput();
        param.email = 'test@localhost.com';
        param.activeKey = crypto.randomBytes(32).toString('hex');

        const error = await activeClientHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.DATA_INVALID);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Active client with params invalid error - Account is actived already', async () => {
        clientTest.activeKey = crypto.randomBytes(32).toString('hex');
        clientTest.status = ClientStatus.Actived;
        sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);

        const param = new ActiveClientInput();
        param.email = 'test@localhost.com';
        param.activeKey = clientTest.activeKey;

        const error = await activeClientHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.DATA_INVALID);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Active client with active key expired error', async () => {
        clientTest.activeKey = crypto.randomBytes(32).toString('hex');
        clientTest.activeExpire = addSeconds(new Date(), -1);
        sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);

        const param = new ActiveClientInput();
        param.email = 'test@localhost.com';
        param.activeKey = clientTest.activeKey;

        const error = await activeClientHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_EXPIRED, { t: 'activation_key' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Active client', async () => {
        clientTest.activeKey = crypto.randomBytes(32).toString('hex');
        clientTest.activeExpire = addSeconds(new Date(), 1);
        sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const param = new ActiveClientInput();
        param.email = 'test@localhost.com';
        param.activeKey = clientTest.activeKey;

        const result = await activeClientHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
