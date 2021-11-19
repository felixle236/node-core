import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Manager } from 'domain/entities/user/Manager';
import { GenderType } from 'domain/enums/user/GenderType';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { expect } from 'chai';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UpdateMyProfileManagerHandler } from './UpdateMyProfileManagerHandler';
import { UpdateMyProfileManagerInput } from './UpdateMyProfileManagerInput';

describe('Manager usecases - Update my profile manager', () => {
    const sandbox = createSandbox();
    let managerRepository: IManagerRepository;
    let updateMyProfileManagerHandler: UpdateMyProfileManagerHandler;
    let managerTest: Manager;
    let param: UpdateMyProfileManagerInput;

    before(() => {
        managerRepository = mockRepositoryInjection<IManagerRepository>(InjectRepository.Manager);
        updateMyProfileManagerHandler = new UpdateMyProfileManagerHandler(managerRepository);
    });

    beforeEach(() => {
        managerTest = new Manager();

        param = new UpdateMyProfileManagerInput();
        param.firstName = 'Manager';
        param.lastName = 'Test';
        param.gender = GenderType.Female;
        param.birthday = '2000-06-08';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Update my profile manager with data not found error', async () => {
        sandbox.stub(managerRepository, 'get').resolves();
        const error = await updateMyProfileManagerHandler.handle(randomUUID(), param).catch(error => error);
        const err = new NotFoundError();

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update my profile manager', async () => {
        sandbox.stub(managerRepository, 'get').resolves(managerTest);
        sandbox.stub(managerRepository, 'update').resolves(true);

        const result = await updateMyProfileManagerHandler.handle(randomUUID(), param);
        expect(result.data).to.eq(true);
    });
});
