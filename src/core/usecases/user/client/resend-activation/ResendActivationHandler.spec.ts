/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Client } from '@domain/entities/user/Client';
import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { IRequest } from '@shared/request/IRequest';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ResendActivationHandler } from './ResendActivationHandler';
import { ResendActivationInput } from './ResendActivationInput';

describe('Client usecases - Resend activation', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let resendActivationHandler: ResendActivationHandler;
    let clientTest: Client;
    let param: ResendActivationInput;

    before(() => {
        Container.set('client.repository', {
            getByEmail() {},
            update() {}
        });
        Container.set('mail.service', {
            resendUserActivation() {}
        });

        clientRepository = Container.get<IClientRepository>('client.repository');
        resendActivationHandler = Container.get(ResendActivationHandler);
    });

    beforeEach(() => {
        clientTest = new Client();

        param = new ResendActivationInput();
        param.email = 'client.test@localhost.com';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Resend activation with data not found error', async () => {
        sandbox.stub(clientRepository, 'getByEmail').resolves(null);
        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        const error = await resendActivationHandler.handle(param, usecaseOption).catch(error => error);
        const err = new SystemError(MessageError.DATA_INVALID);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Resend activation', async () => {
        const usecaseOption = new UsecaseOption();
        usecaseOption.req = {} as IRequest;
        sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const result = await resendActivationHandler.handle(param, usecaseOption);
        expect(result.data).to.eq(true);
    });
});
