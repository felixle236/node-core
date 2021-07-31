/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Auth } from '@domain/entities/auth/Auth';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';
import { UpdateMyPasswordByEmailCommandHandler } from './UpdateMyPasswordByEmailCommandHandler';
import { UpdateMyPasswordByEmailCommandInput } from './UpdateMyPasswordByEmailCommandInput';

describe('Auth - Update my password by email', () => {
    const sandbox = createSandbox();
    let authRepository: IAuthRepository;
    let updateMyPasswordByEmailCommandHandler: UpdateMyPasswordByEmailCommandHandler;
    let authTests: Auth[];
    let param: UpdateMyPasswordByEmailCommandInput;

    before(() => {
        Container.set('auth.repository', {
            getAllByUser() {},
            update() {}
        });

        authRepository = Container.get<IAuthRepository>('auth.repository');
        updateMyPasswordByEmailCommandHandler = Container.get(UpdateMyPasswordByEmailCommandHandler);
    });

    beforeEach(() => {
        const auth = new Auth();
        auth.type = AuthType.PERSONAL_EMAIL;
        auth.password = 'Nodecore@2';
        authTests = [auth];

        param = new UpdateMyPasswordByEmailCommandInput();
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

        const error: SystemError = await updateMyPasswordByEmailCommandHandler.handle(v4(), param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_INCORRECT, 'old password');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Update my password by email', async () => {
        sandbox.stub(authRepository, 'getAllByUser').resolves(authTests);
        sandbox.stub(authRepository, 'update').resolves(true);

        const result = await updateMyPasswordByEmailCommandHandler.handle(v4(), param);
        expect(result.data).to.eq(true);
    });
});
