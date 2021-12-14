import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { AuthType } from 'domain/enums/auth/AuthType';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { expect } from 'chai';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockRepositoryInjection } from 'shared/test/MockInjection';
import { InjectRepository } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UpdateMyPasswordByEmailHandler } from './UpdateMyPasswordByEmailHandler';
import { UpdateMyPasswordByEmailInput } from './UpdateMyPasswordByEmailInput';

describe('Authorization usecases - Update my password by email', () => {
    const sandbox = createSandbox();
    let authRepository: IAuthRepository;
    let updateMyPasswordByEmailHandler: UpdateMyPasswordByEmailHandler;
    let authTests: Auth[];
    let param: UpdateMyPasswordByEmailInput;

    before(() => {
        authRepository = mockRepositoryInjection<IAuthRepository>(InjectRepository.Auth, ['getAllByUser']);
        updateMyPasswordByEmailHandler = new UpdateMyPasswordByEmailHandler(authRepository);
    });

    beforeEach(() => {
        const auth = new Auth();
        auth.type = AuthType.PersonalEmail;
        auth.password = Auth.hashPassword('Nodecore@2');
        authTests = [auth];

        param = new UpdateMyPasswordByEmailInput();
        param.oldPassword = 'Nodecore@2';
        param.password = 'Nodecore@2222';
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Update my password by email with user is not exist error', async () => {
        sandbox.stub(authRepository, 'getAllByUser').resolves([]);

        const error: LogicalError = await updateMyPasswordByEmailHandler.handle(randomUUID(), param).catch(error => error);
        const err = new LogicalError(MessageError.PARAM_INCORRECT, { t: 'old_password' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update my password by email', async () => {
        sandbox.stub(authRepository, 'getAllByUser').resolves(authTests);
        sandbox.stub(authRepository, 'update').resolves(true);

        const result = await updateMyPasswordByEmailHandler.handle(randomUUID(), param);
        expect(result.data).to.eq(true);
    });
});
