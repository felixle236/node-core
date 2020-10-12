import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { ForgotPasswordCommand } from './ForgotPasswordCommand';
import { ForgotPasswordCommandHandler } from './ForgotPasswordCommandHandler';
import { IMailService } from '../../../../gateways/services/IMailService';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('user.repository', {
    async getByEmail() {},
    async update() {}
});
Container.set('mail.service', {
    async sendForgotPassword() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const mailService = Container.get<IMailService>('mail.service');
const forgotPasswordCommandHandler = Container.get(ForgotPasswordCommandHandler);

const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: uuid.v4(), status: UserStatus.ACTIVED, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Forgot password', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Forgot password without email', async () => {
        const param = new ForgotPasswordCommand();

        const result = await forgotPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Forgot password with email is invalid', async () => {
        const param = new ForgotPasswordCommand();
        param.email = 'test@abc';

        const result = await forgotPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Forgot password with email not found', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(undefined);
        const param = new ForgotPasswordCommand();
        param.email = 'test@localhost.com';

        const result = await forgotPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Forgot password with account is not activated', async () => {
        user.status = UserStatus.INACTIVE;
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ForgotPasswordCommand();
        param.email = 'test@localhost.com';

        const result = await forgotPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Forgot password with data cannot save', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(false);
        const param = new ForgotPasswordCommand();
        param.email = 'test@localhost.com';

        const result = await forgotPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Forgot password successfully', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(true);
        sandbox.stub(mailService, 'sendForgotPassword').resolves();
        const param = new ForgotPasswordCommand();
        param.email = 'test@localhost.com';

        const hasSucceed = await forgotPasswordCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
