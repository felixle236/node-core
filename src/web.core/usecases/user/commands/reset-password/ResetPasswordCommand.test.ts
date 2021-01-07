import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { ResetPasswordCommand } from './ResetPasswordCommand';
import { ResetPasswordCommandHandler } from './ResetPasswordCommandHandler';
import { addDays } from '../../../../../libs/date';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

Container.set('user.repository', {
    async getByEmail() {},
    async update() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const resetPasswordCommandHandler = Container.get(ResetPasswordCommandHandler);

const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: uuid.v4(), status: UserStatus.ACTIVED, firstName: 'User', lastName: '1', email: 'user1@localhost.com', forgotKey: 'key', forgotExpire: addDays(new Date(), 10) } as IUser);
};

describe('User - Reset password', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Reset password without email', async () => {
        const param = new ResetPasswordCommand();

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Reset password with email is invalid', async () => {
        const param = new ResetPasswordCommand();
        param.email = 'test@abc';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Reset password without forgot key', async () => {
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'forgot key'));
    });

    it('Reset password without new password', async () => {
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'password'));
    });

    it('Reset password with email not found', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(undefined);
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';
        param.password = 'Nodecore@2';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Reset password with wrong forgot key', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key1';
        param.password = 'Nodecore@2';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Reset password with account is not activated', async () => {
        user.status = UserStatus.INACTIVE;
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';
        param.password = 'Nodecore@2';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Reset password with forgot key has expired', async () => {
        user.forgotExpire = addDays(new Date(), -1);
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';
        param.password = 'Nodecore@2';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXPIRED, 'forgot key'));
    });

    it('Reset password with the length of password greater than 20 characters', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';
        param.password = 'This is the password with length greater than 20 characters!';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'password', 20));
    });

    it('Reset password with password is not secure', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';
        param.password = '123456';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20));
    });

    it('Reset password with data cannot save', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(false);
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';
        param.password = 'Nodecore@2';

        const result = await resetPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Reset password successfully', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(true);
        const param = new ResetPasswordCommand();
        param.email = 'test@localhost.com';
        param.forgotKey = 'key';
        param.password = 'Nodecore@2';

        const hasSucceed = await resetPasswordCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
