import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { ValidateForgotKeyForEmailCommand } from './ValidateForgotKeyForEmailCommand';
import { ValidateForgotKeyForEmailCommandHandler } from './ValidateForgotKeyForEmailCommandHandler';
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
    async getByUsername() {}
});
Container.set('auth_jwt.service', {
    sign() {}
});

const authRepository = Container.get<IAuthRepository>('auth.repository');
const validateForgotKeyForEmailCommandHandler = Container.get(ValidateForgotKeyForEmailCommandHandler);

const generateAuth = () => {
    const user = new User({ id: uuid.v4(), status: UserStatus.ACTIVE, roleId: uuid.v4() } as IUser);
    return new Auth({ id: uuid.v4(), createdAt: new Date(), userId: user.id, user: user.toData(), type: AuthType.PERSONAL_EMAIL, username: 'test@localhost.com', forgotKey: 'key', forgotExpire: addDays(new Date(), 10) } as IAuth);
};

describe('Authentication - Validate forgot key for email', () => {
    const sandbox = createSandbox();
    let auth: Auth;

    beforeEach(() => {
        auth = generateAuth();
        auth.password = 'Nodecore@2';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Validate forgot key without email', async () => {
        const param = new ValidateForgotKeyForEmailCommand();

        const result = await validateForgotKeyForEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Validate forgot key with email invalid', async () => {
        const param = new ValidateForgotKeyForEmailCommand();
        param.email = 'test@localhost';

        const result = await validateForgotKeyForEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Validate forgot key without forgot key', async () => {
        const param = new ValidateForgotKeyForEmailCommand();
        param.email = 'test@localhost.com';

        const result = await validateForgotKeyForEmailCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'forgot key'));
    });

    it('Validate forgot key with email is not exist', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        const param = new ValidateForgotKeyForEmailCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';

        const isValid = await validateForgotKeyForEmailCommandHandler.handle(param);
        expect(isValid).to.eq(false);
    });

    it('Validate forgot key successfully', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        const param = new ValidateForgotKeyForEmailCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';

        const isValid = await validateForgotKeyForEmailCommandHandler.handle(param);
        expect(isValid).to.eq(true);
    });
});
