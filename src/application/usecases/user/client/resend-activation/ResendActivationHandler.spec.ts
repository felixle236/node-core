import 'reflect-metadata';
import 'mocha';
import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IMailService } from 'application/interfaces/services/IMailService';
import { expect } from 'chai';
import { Request } from 'express';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockFunction } from 'shared/test/MockFunction';
import { mockInjection, mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ResendActivationHandler } from './ResendActivationHandler';
import { ResendActivationInput } from './ResendActivationSchema';

describe('Client usecases - Resend activation', () => {
  const sandbox = createSandbox();
  let mailService: IMailService;
  let clientRepository: IClientRepository;
  let resendActivationHandler: ResendActivationHandler;
  let clientTest: Client;
  let param: ResendActivationInput;

  before(() => {
    mailService = mockInjection(InjectService.Mail, {
      resendUserActivation: mockFunction(),
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
    usecaseOption.req = {} as Request;
    const error = await resendActivationHandler.handle(param, usecaseOption).catch((error) => error);
    const err = new LogicalError(MessageError.DATA_INVALID);

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Resend activation', async () => {
    const usecaseOption = new UsecaseOption();
    usecaseOption.req = {} as Request;
    clientTest.status = ClientStatus.Unverified;
    sandbox.stub(clientRepository, 'getByEmail').resolves(clientTest);
    sandbox.stub(clientRepository, 'update').resolves(true);

    const result = await resendActivationHandler.handle(param, usecaseOption);
    expect(result.data).to.eq(true);
  });
});
