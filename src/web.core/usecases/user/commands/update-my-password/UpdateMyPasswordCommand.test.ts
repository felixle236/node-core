import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateMyPasswordCommand } from './UpdateMyPasswordCommand';
import { UpdateMyPasswordCommandHandler } from './UpdateMyPasswordCommandHandler';
import { User } from '../../../../domain/entities/user/User';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('user.repository', {
    async getById() {},
    async update() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const updateMyPasswordCommandHandler = Container.get(UpdateMyPasswordCommandHandler);

const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: uuid.v4(), firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Update my password', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
        user.password = 'Nodecore@123';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Update my password without permission', async () => {
        const param = new UpdateMyPasswordCommand();

        const result = await updateMyPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Update my password without new password', async () => {
        const param = new UpdateMyPasswordCommand();
        param.userAuthId = user.id;

        const result = await updateMyPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'password'));
    });

    it('Update my password with the length of password greater than 20 characters', async () => {
        const param = new UpdateMyPasswordCommand();
        param.userAuthId = user.id;
        param.password = 'This is the password with length greater than 20 characters!';

        const result = await updateMyPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'password', 20));
    });

    it('Update my password with password is not secure', async () => {
        const param = new UpdateMyPasswordCommand();
        param.userAuthId = user.id;
        param.password = '123456';

        const result = await updateMyPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20));
    });

    it('Update my password with old password is not correct', async () => {
        user.password = 'Test@123';
        sandbox.stub(userRepository, 'getById').resolves(user);
        const param = new UpdateMyPasswordCommand();
        param.userAuthId = user.id;
        param.oldPassword = 'Nodecore@123';
        param.password = 'Nodecore@2';

        const result = await updateMyPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INCORRECT, 'old password'));
    });

    it('Update my password with data cannot save', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(false);
        const param = new UpdateMyPasswordCommand();
        param.userAuthId = user.id;
        param.oldPassword = 'Nodecore@123';
        param.password = 'Nodecore@2';

        const result = await updateMyPasswordCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Update my password successfully', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(true);
        const param = new UpdateMyPasswordCommand();
        param.userAuthId = user.id;
        param.oldPassword = 'Nodecore@123';
        param.password = 'Nodecore@2';

        const hasSucceed = await updateMyPasswordCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
