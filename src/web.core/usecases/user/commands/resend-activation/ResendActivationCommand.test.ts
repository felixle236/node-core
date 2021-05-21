import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { ResendActivationCommand } from './ResendActivationCommand';
import { ResendActivationCommandHandler } from './ResendActivationCommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { IMailService } from '../../../../gateways/services/IMailService';

Container.set('user.repository', {
    async getByEmail() {},
    async update() {}
});
Container.set('mail.service', {
    async resendUserActivation() {}
});

const userRepository = Container.get<IUserRepository>('user.repository');
const mailService = Container.get<IMailService>('mail.service');
const resendActivationCommandHandler = Container.get(ResendActivationCommandHandler);

const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: uuid.v4(), status: UserStatus.INACTIVE, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Resend activation', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Resend activation without email', async () => {
        const param = new ResendActivationCommand();

        const result = await resendActivationCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Resend activation with email is invalid', async () => {
        const param = new ResendActivationCommand();
        param.email = 'test@abc';

        const result = await resendActivationCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Resend activation with email not found', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(null);
        const param = new ResendActivationCommand();
        param.email = 'test@localhost.com';

        const result = await resendActivationCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Resend activation with account is not activated', async () => {
        user.status = UserStatus.ACTIVE;
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ResendActivationCommand();
        param.email = 'test@localhost.com';

        const result = await resendActivationCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Resend activation with data cannot save', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(false);
        const param = new ResendActivationCommand();
        param.email = 'test@localhost.com';

        const result = await resendActivationCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Resend activation successfully', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(true);
        sandbox.stub(mailService, 'resendUserActivation').resolves();
        const param = new ResendActivationCommand();
        param.email = 'test@localhost.com';

        const hasSucceed = await resendActivationCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
