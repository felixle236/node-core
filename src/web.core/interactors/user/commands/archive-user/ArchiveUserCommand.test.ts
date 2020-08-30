import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { ArchiveUserCommand } from './ArchiveUserCommand';
import { ArchiveUserCommandHandler } from './ArchiveUserCommandHandler';
import { Container } from 'typedi';
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
    async update() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const archiveUserCommandHandler = Container.get(ArchiveUserCommandHandler);

const roleData = { id: uuid.v4(), name: 'Role 2', level: 2 } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Archive user', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Archive user without id', async () => {
        const param = new ArchiveUserCommand();

        const result = await archiveUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Archive user without permission', async () => {
        const param = new ArchiveUserCommand();
        param.id = user.id;

        const result = await archiveUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Archive user with data not found', async () => {
        sandbox.stub(userRepository, 'getById').resolves(undefined);
        const param = new ArchiveUserCommand();
        param.roleAuthLevel = 1;
        param.id = user.id;

        const result = await archiveUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_NOT_FOUND));
    });

    it('Archive user with access denied', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        const param = new ArchiveUserCommand();
        param.roleAuthLevel = 2;
        param.id = user.id;

        const result = await archiveUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.ACCESS_DENIED));
    });

    it('Archive user with data cannot save', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(false);
        const param = new ArchiveUserCommand();
        param.roleAuthLevel = 1;
        param.id = user.id;

        const result = await archiveUserCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Archive user successfully', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        sandbox.stub(userRepository, 'update').resolves(true);
        const param = new ArchiveUserCommand();
        param.roleAuthLevel = 1;
        param.id = user.id;

        const hasSucceed = await archiveUserCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
