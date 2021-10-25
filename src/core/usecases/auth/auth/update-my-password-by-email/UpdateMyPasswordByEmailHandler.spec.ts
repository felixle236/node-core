/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Auth } from '@domain/entities/auth/Auth';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
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
        Container.set('auth.repository', {
            getAllByUser() {},
            update() {}
        });

        authRepository = Container.get<IAuthRepository>('auth.repository');
        updateMyPasswordByEmailHandler = Container.get(UpdateMyPasswordByEmailHandler);
    });

    beforeEach(() => {
        const auth = new Auth();
        auth.type = AuthType.PersonalEmail;
        auth.password = 'Nodecore@2';
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

        const error: SystemError = await updateMyPasswordByEmailHandler.handle(randomUUID(), param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_INCORRECT, { t: 'old_password' });

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
