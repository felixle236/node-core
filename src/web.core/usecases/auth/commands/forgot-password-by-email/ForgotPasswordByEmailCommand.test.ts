import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { ForgotPasswordByEmailCommand } from './ForgotPasswordByEmailCommand';
import { ForgotPasswordByEmailCommandHandler } from './ForgotPasswordByEmailCommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { User } from '../../../../domain/entities/user/User';
import { AuthType } from '../../../../domain/enums/auth/AuthType';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IAuth } from '../../../../domain/types/auth/IAuth';
import { IUser } from '../../../../domain/types/user/IUser';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IMailService } from '../../../../gateways/services/IMailService';

Container.set('auth.repository', {
    async getByUsername() {},
    async update() {}
});
Container.set('mail.service', {
    async sendForgotPassword() {}
});

const authRepository = Container.get<IAuthRepository>('auth.repository');
const mailService = Container.get<IMailService>('mail.service');
const forgotPasswordByEmailCommandHandler = Container.get(ForgotPasswordByEmailCommandHandler);

const generateAuth = () => {
    const user = new User({ id: uuid.v4(), status: UserStatus.ACTIVE } as IUser);
    return new Auth({ id: uuid.v4(), createdAt: new Date(), userId: user.id, user: user.toData(), type: AuthType.PERSONAL_EMAIL, username: 'user1@localhost.com' } as IAuth);
};

describe('Authentication - Forgot password by email', () => {
    const sandbox = createSandbox();
    let auth: Auth;

    beforeEach(() => {
        auth = generateAuth();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Forgot password by email without email', async () => {
        const param = new ForgotPasswordByEmailCommand();

        const result = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Forgot password by email with email is invalid', async () => {
        const param = new ForgotPasswordByEmailCommand();
        param.email = 'test@abc';

        const result = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_EXISTS, 'account'));
    });

    it('Forgot password by email with email not found', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        const param = new ForgotPasswordByEmailCommand();
        param.email = 'test@localhost.com';

        const result = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_EXISTS, 'account'));
    });

    it('Forgot password by email with account is not activated', async () => {
        auth.user!.status = UserStatus.INACTIVE;
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        const param = new ForgotPasswordByEmailCommand();
        param.email = 'test@localhost.com';

        const result = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account'));
    });

    it('Forgot password by email with data cannot save', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        sandbox.stub(authRepository, 'update').resolves(false);
        const param = new ForgotPasswordByEmailCommand();
        param.email = 'test@localhost.com';

        const result = await forgotPasswordByEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Forgot password by email successfully', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        sandbox.stub(authRepository, 'update').resolves(true);
        sandbox.stub(mailService, 'sendForgotPassword').resolves();
        const param = new ForgotPasswordByEmailCommand();
        param.email = 'test@localhost.com';

        const hasSucceed = await forgotPasswordByEmailCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
