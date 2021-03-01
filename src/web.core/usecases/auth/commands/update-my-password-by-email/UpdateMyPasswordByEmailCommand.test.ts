import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { UpdateMyPasswordByEmailCommand } from './UpdateMyPasswordByEmailCommand';
import { UpdateMyPasswordByEmailCommandHandler } from './UpdateMyPasswordByEmailCommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { AuthType } from '../../../../domain/enums/auth/AuthType';
import { IAuth } from '../../../../domain/types/auth/IAuth';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';

Container.set('auth.repository', {
    async getAllByUser() {},
    async update() {}
});

const authRepository = Container.get<IAuthRepository>('auth.repository');
const updateMyPasswordByEmailCommandHandler = Container.get(UpdateMyPasswordByEmailCommandHandler);

const generateAuth = () => {
    return new Auth({ id: uuid.v4(), createdAt: new Date(), userId: uuid.v4(), type: AuthType.PERSONAL_EMAIL, username: 'user1@localhost.com' } as IAuth);
};

describe('Authentication - Update my password by email', () => {
    const sandbox = createSandbox();
    let auth: Auth;

    beforeEach(() => {
        auth = generateAuth();
        auth.password = 'Nodecore@123';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Update my password by email without permission', async () => {
        const param = new UpdateMyPasswordByEmailCommand();

        const result = await updateMyPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Update my password by email without new password', async () => {
        const param = new UpdateMyPasswordByEmailCommand();
        param.userAuthId = auth.userId;

        const result = await updateMyPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'password'));
    });

    it('Update my password by email with the length of password greater than 20 characters', async () => {
        const param = new UpdateMyPasswordByEmailCommand();
        param.userAuthId = auth.userId;
        param.password = 'This is the password with length greater than 20 characters!';

        const result = await updateMyPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'password', 20));
    });

    it('Update my password by email with password is not secure', async () => {
        const param = new UpdateMyPasswordByEmailCommand();
        param.userAuthId = auth.userId;
        param.password = '123456';

        const result = await updateMyPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20));
    });

    it('Update my password by email with old password is not correct', async () => {
        auth.password = 'Test@123';
        sandbox.stub(authRepository, 'getAllByUser').resolves([auth]);
        const param = new UpdateMyPasswordByEmailCommand();
        param.userAuthId = auth.userId;
        param.oldPassword = 'Nodecore@123';
        param.password = 'Nodecore@2';

        const result = await updateMyPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INCORRECT, 'old password'));
    });

    it('Update my password by email with data cannot save', async () => {
        sandbox.stub(authRepository, 'getAllByUser').resolves([auth]);
        sandbox.stub(authRepository, 'update').resolves(false);
        const param = new UpdateMyPasswordByEmailCommand();
        param.userAuthId = auth.userId;
        param.oldPassword = 'Nodecore@123';
        param.password = 'Nodecore@2';

        const result = await updateMyPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Update my password by email successfully', async () => {
        sandbox.stub(authRepository, 'getAllByUser').resolves([auth]);
        sandbox.stub(authRepository, 'update').resolves(true);
        const param = new UpdateMyPasswordByEmailCommand();
        param.userAuthId = auth.userId;
        param.oldPassword = 'Nodecore@123';
        param.password = 'Nodecore@2';

        const hasSucceed = await updateMyPasswordByEmailCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
