import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { ResetPasswordByEmailCommand } from './ResetPasswordByEmailCommand';
import { ResetPasswordByEmailCommandHandler } from './ResetPasswordByEmailCommandHandler';
import { addDays } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { User } from '../../../../domain/entities/user/User';
import { AuthType } from '../../../../domain/enums/auth/AuthType';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IAuth } from '../../../../domain/types/auth/IAuth';
import { IUser } from '../../../../domain/types/user/IUser';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';

Container.set('auth.repository', {
    async getByUsername() {},
    async update() {}
});

const authRepository = Container.get<IAuthRepository>('auth.repository');
const resetPasswordByEmailCommandHandler = Container.get(ResetPasswordByEmailCommandHandler);

const generateAuth = () => {
    const user = new User({ id: uuid.v4(), status: UserStatus.ACTIVE } as IUser);
    return new Auth({ id: uuid.v4(), createdAt: new Date(), userId: user.id, user: user.toData(), type: AuthType.PERSONAL_EMAIL, username: 'user1@localhost.com', forgotKey: 'key', forgotExpire: addDays(new Date(), 10) } as IAuth);
};

describe('Authentication - Reset password by email', () => {
    const sandbox = createSandbox();
    let auth: Auth;

    beforeEach(() => {
        auth = generateAuth();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Reset password by email without forgot key', async () => {
        const param = new ResetPasswordByEmailCommand();

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'forgot key'));
    });

    it('Reset password by email without email', async () => {
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Reset password by email without new password', async () => {
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';
        param.email = 'test@localhost.com';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'password'));
    });

    it('Reset password by email with account is not exist', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_EXISTS, 'account'));
    });

    it('Reset password by email with account is not activated', async () => {
        auth.user!.status = UserStatus.INACTIVE;
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account'));
    });

    it('Reset password by email with forgot key incorrect', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key1';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INCORRECT, 'forgot key'));
    });

    it('Reset password by email with forgot key has expired', async () => {
        auth.forgotExpire = addDays(new Date(), -1);
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXPIRED, 'forgot key'));
    });

    it('Reset password by email with the length of password greater than 20 characters', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';
        param.email = 'test@localhost.com';
        param.password = 'This is the password with length greater than 20 characters!';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'password', 20));
    });

    it('Reset password by email with password is not secure', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';
        param.email = 'test@localhost.com';
        param.password = '123456';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20));
    });

    it('Reset password by email with data cannot save', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        sandbox.stub(authRepository, 'update').resolves(false);
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await resetPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Reset password by email successfully', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        sandbox.stub(authRepository, 'update').resolves(true);
        const param = new ResetPasswordByEmailCommand();
        param.forgotKey = 'key';
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const hasSucceed = await resetPasswordByEmailCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
