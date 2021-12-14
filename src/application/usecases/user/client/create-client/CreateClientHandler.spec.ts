import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { GenderType } from 'domain/enums/user/GenderType';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { CreateAuthByEmailHandler } from 'application/usecases/auth/auth/create-auth-by-email/CreateAuthByEmailHandler';
import { AddressInfoData } from 'application/usecases/common/AddressInfoData';
import { expect } from 'chai';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockDbContext } from 'shared/test/MockDbContext';
import { mockRepositoryInjection, mockUsecaseInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { CreateClientHandler } from './CreateClientHandler';
import { CreateClientInput } from './CreateClientInput';
import { CheckEmailExistHandler } from '../../user/check-email-exist/CheckEmailExistHandler';
import { CheckEmailExistOutput } from '../../user/check-email-exist/CheckEmailExistOutput';

describe('Client usecases - Create client', () => {
    const sandbox = createSandbox();
    let dbContext: IDbContext;
    let clientRepository: IClientRepository;
    let authRepository: IAuthRepository;
    let checkEmailExistHandler: CheckEmailExistHandler;
    let createAuthByEmailHandler: CreateAuthByEmailHandler;
    let createClientHandler: CreateClientHandler;
    let param: CreateClientInput;

    before(async () => {
        dbContext = await mockDbContext();
        checkEmailExistHandler = mockUsecaseInjection(CheckEmailExistHandler);
        createAuthByEmailHandler = mockUsecaseInjection(CreateAuthByEmailHandler);
        authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getByUsername']);
        clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
        createClientHandler = new CreateClientHandler(dbContext, checkEmailExistHandler, createAuthByEmailHandler, authRepository, clientRepository);
    });

    beforeEach(() => {
        param = new CreateClientInput();
        param.firstName = 'Client';
        param.lastName = 'Test';
        param.email = 'client.test@localhost.com';
        param.password = 'Nodecore@2';
        param.gender = GenderType.Female;
        param.birthday = '1970-01-01';
        param.phone = '0123456789';
        param.address = new AddressInfoData();
        param.address.street = '123 Abc';
        param.locale = 'en-US';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(async () => {
        Container.reset();
        await dbContext.destroyConnection();
    });

    it('Create client with email exist error', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = true;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);

        const error: LogicalError = await createClientHandler.handle(param).catch(error => error);
        const err = new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create client with user authorization exist error', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = false;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        const auth = new Auth();
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);

        const error: LogicalError = await createClientHandler.handle(param).catch(error => error);
        const err = new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Create client', async () => {
        const checkEmailResult = new CheckEmailExistOutput();
        checkEmailResult.data = false;
        sandbox.stub(checkEmailExistHandler, 'handle').resolves(checkEmailResult);
        sandbox.stub(authRepository, 'getByUsername').resolves();
        const id = randomUUID();
        sandbox.stub(clientRepository, 'create').resolves(id);

        const result = await createClientHandler.handle(param);
        expect(result.data).to.eq(id);
    });
});
