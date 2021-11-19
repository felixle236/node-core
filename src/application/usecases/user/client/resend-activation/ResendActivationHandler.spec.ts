import 'reflect-metadata';
import 'mocha';
import { Client } from 'domain/entities/user/Client';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IMailService } from 'application/interfaces/services/IMailService';
import { expect } from 'chai';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { IRequest } from 'shared/request/IRequest';
import { mockFunction } from 'shared/test/MockFunction';
import { mockInjection, mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ResendActivationHandler } from './ResendActivationHandler';
import { ResendActivationInput } from './ResendActivationInput';

describe('Client usecases - Resend activation', () => {
    const sandbox = createSandbox();
    let mailService: IMailService;
    let clientRepository: IClientRepository;
    let resendActivationHandler: ResendActivationHandler;
    let clientTest: Client;
    let param: ResendActivationInput;

    before(() => {
        mailService = mockInjection(InjectService.Mail, {
            resendUserActivation: mockFunction()
        });
        clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client, ['getByEmail']);
        resendActivationHandler = new ResendActivationHandler(mailService, clientRepository);
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
        sandbox.stub(clientRepository, 'getByEmail').resolves();
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
