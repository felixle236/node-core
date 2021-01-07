import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { DeleteUserCommand } from './DeleteUserCommand';
import { DeleteUserCommandHandler } from './DeleteUserCommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { IRole } from '../../../../domain/types/role/IRole';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

Container.set('user.repository', {
    async getById() {},
    async delete() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const deleteUserCommandHandler = Container.get(DeleteUserCommandHandler);

const roleData = { id: uuid.v4(), name: 'Role 2' } as IRole;
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

    it('Delete user with data not found', async () => {
        sandbox.stub(userRepository, 'getById').resolves(undefined);
        const param = new DeleteUserCommand();
        param.id = user.id;

        const result = await deleteUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_NOT_FOUND));
    });

    it('Delete user with data cannot save', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'delete').resolves(false);
        const param = new DeleteUserCommand();
        param.id = user.id;

        const result = await deleteUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Delete user successfully', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'delete').resolves(true);
        const param = new DeleteUserCommand();
        param.id = user.id;

        const hasSucceed = await deleteUserCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
