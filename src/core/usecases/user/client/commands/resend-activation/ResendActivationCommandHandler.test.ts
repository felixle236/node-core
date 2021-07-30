/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Client } from '@domain/entities/user/Client';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ResendActivationCommandHandler } from './ResendActivationCommandHandler';
import { ResendActivationCommandInput } from './ResendActivationCommandInput';

Container.set('client.repository', {
    getByEmail() {},
    update() {}
});
Container.set('mail.service', {
    resendUserActivation() {}
});
const clientRepository = Container.get<IClientRepository>('client.repository');
const resendActivationCommandHandler = Container.get(ResendActivationCommandHandler);

describe('Client - Resend activation', () => {
    const sandbox = createSandbox();
    let dataTest: Client;
    let param: ResendActivationCommandInput;

    beforeEach(() => {
        dataTest = new Client();

        param = new ResendActivationCommandInput();
        param.email = 'client.test@localhost.com';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Resend activation with data not found error', async () => {
        sandbox.stub(clientRepository, 'getByEmail').resolves(null);
        const error = await resendActivationCommandHandler.handle(param).catch(error => error);
        const err = new SystemError(MessageError.DATA_INVALID);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Resend activation', async () => {
        sandbox.stub(clientRepository, 'getByEmail').resolves(dataTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const result = await resendActivationCommandHandler.handle(param);
        expect(result.data).to.eq(true);
    });
});
