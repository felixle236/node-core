import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Client } from 'domain/entities/user/Client';
import { GenderType } from 'domain/enums/user/GenderType';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { AddressInfoData } from 'application/usecases/common/AddressInfoData';
import { expect } from 'chai';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UpdateMyProfileClientHandler } from './UpdateMyProfileClientHandler';
import { UpdateMyProfileClientInput } from './UpdateMyProfileClientInput';

describe('Client usecases - Update my profile client', () => {
    const sandbox = createSandbox();
    let clientRepository: IClientRepository;
    let updateMyProfileClientHandler: UpdateMyProfileClientHandler;
    let clientTest: Client;
    let param: UpdateMyProfileClientInput;

    before(() => {
        clientRepository = mockRepositoryInjection<IClientRepository>(InjectRepository.Client);
        updateMyProfileClientHandler = new UpdateMyProfileClientHandler(clientRepository);
    });

    beforeEach(() => {
        clientTest = new Client();

        param = new UpdateMyProfileClientInput();
        param.firstName = 'Client';
        param.lastName = 'Test';
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

    after(() => {
        Container.reset();
    });

    it('Update my profile client with data not found error', async () => {
        sandbox.stub(clientRepository, 'get').resolves();
        const error = await updateMyProfileClientHandler.handle(randomUUID(), param).catch(error => error);
        const err = new NotFoundError();

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update my profile client', async () => {
        sandbox.stub(clientRepository, 'get').resolves(clientTest);
        sandbox.stub(clientRepository, 'update').resolves(true);

        const result = await updateMyProfileClientHandler.handle(randomUUID(), param);
        expect(result.data).to.eq(true);
    });
});
