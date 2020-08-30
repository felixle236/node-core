import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { ActiveUserCommand } from './ActiveUserCommand';
import { ActiveUserCommandHandler } from './ActiveUserCommandHandler';
import { Container } from 'typedi';
import { IUser } from '../../../../domain/types/IUser';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';
import { addDays } from '../../../../../libs/date';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('user.repository', {
    async getByEmail() {},
    async update() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const activeUserCommandHandler = Container.get(ActiveUserCommandHandler);

const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: uuid.v4(), status: UserStatus.INACTIVE, activeExpire: addDays(new Date(), 10), firstName: 'User', lastName: '1', email: 'user1@localhost.com', activeKey: 'key' } as IUser);
};

describe('User - Active user', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Active user without email', async () => {
        const param = new ActiveUserCommand();

        const result = await activeUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Active user with email is invalid', async () => {
        const param = new ActiveUserCommand();
        param.email = 'test@abc';

        const result = await activeUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'email'));
    });

    it('Active user without activation key', async () => {
        const param = new ActiveUserCommand();
        param.email = 'test@localhost.com';

        const result = await activeUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'activation key'));
    });

    it('Active user with email not found', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(undefined);
        const param = new ActiveUserCommand();
        param.email = 'test@localhost.com';
        param.activeKey = 'key';

        const result = await activeUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Active user with wrong activation key', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ActiveUserCommand();
        param.email = 'test@localhost.com';
        param.activeKey = 'key1';

        const result = await activeUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Active user with account have activated', async () => {
        user.status = UserStatus.ACTIVED;
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ActiveUserCommand();
        param.email = 'test@localhost.com';
        param.activeKey = 'key';

        const result = await activeUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_INVALID));
    });

    it('Active user with activation key has expired', async () => {
        user.activeExpire = addDays(new Date(), -1);
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        const param = new ActiveUserCommand();
        param.email = 'test@localhost.com';
        param.activeKey = 'key';

        const result = await activeUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXPIRED, 'activation key'));
    });

    it('Active user with data cannot save', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(false);
        const param = new ActiveUserCommand();
        param.email = 'test@localhost.com';
        param.activeKey = 'key';

        const result = await activeUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Active user successfully', async () => {
        sandbox.stub(userRepository, 'getByEmail').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(true);
        const param = new ActiveUserCommand();
        param.email = 'test@localhost.com';
        param.activeKey = 'key';

        const hasSucceed = await activeUserCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
