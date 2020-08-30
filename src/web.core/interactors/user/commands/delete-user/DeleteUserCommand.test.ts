import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { DeleteUserCommand } from './DeleteUserCommand';
import { DeleteUserCommandHandler } from './DeleteUserCommandHandler';
import { IRole } from '../../../../domain/types/IRole';
import { IUser } from '../../../../domain/types/IUser';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('user.repository', {
    async getById() {},
    async delete() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const deleteUserCommandHandler = Container.get(DeleteUserCommandHandler);

const roleData = { id: uuid.v4(), name: 'Role 2', level: 2 } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Delete user', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Delete user without id', async () => {
        const param = new DeleteUserCommand();

        const result = await deleteUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Delete user without permission', async () => {
        const param = new DeleteUserCommand();
        param.id = user.id;

        const result = await deleteUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Delete user with data not found', async () => {
        sandbox.stub(userRepository, 'getById').resolves(undefined);
        const param = new DeleteUserCommand();
        param.roleAuthLevel = 1;
        param.id = user.id;

        const result = await deleteUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_NOT_FOUND));
    });

    it('Delete user with access denied', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        const param = new DeleteUserCommand();
        param.roleAuthLevel = 2;
        param.id = user.id;

        const result = await deleteUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.ACCESS_DENIED));
    });

    it('Delete user with data cannot save', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'delete').resolves(false);
        const param = new DeleteUserCommand();
        param.roleAuthLevel = 1;
        param.id = user.id;

        const result = await deleteUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Delete user successfully', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'delete').resolves(true);
        const param = new DeleteUserCommand();
        param.roleAuthLevel = 1;
        param.id = user.id;

        const hasSucceed = await deleteUserCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
