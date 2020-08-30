import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { FindUserQuery } from './FindUserQuery';
import { FindUserQueryHandler } from './FindUserQueryHandler';
import { IRole } from '../../../../domain/types/IRole';
import { IUser } from '../../../../domain/types/IUser';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('user.repository', {
    async findAndCount() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const findUserQueryHandler = Container.get(FindUserQueryHandler);

const roleData = { id: uuid.v4(), name: 'Role 1', level: 1 } as IRole;
const generateUsers = () => {
    return [
        new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser),
        new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '2', email: 'user2@localhost.com' } as IUser),
        new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '3', email: 'user3@localhost.com' } as IUser)
    ];
};

describe('User - Find users', () => {
    const sandbox = createSandbox();
    let list: User[];

    beforeEach(() => {
        list = generateUsers();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Find users without permission', async () => {
        const param = new FindUserQuery();

        const result = await findUserQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Find users successfully', async () => {
        sandbox.stub(userRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindUserQuery();
        param.roleAuthLevel = 1;

        const result = await findUserQueryHandler.handle(param);
        expect(Array.isArray(result.data) && result.data.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find users successfully with params', async () => {
        sandbox.stub(userRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindUserQuery();
        param.roleAuthLevel = 1;
        param.keyword = 'test';
        param.roleId = list[0].roleId;
        param.status = UserStatus.ACTIVED;

        const result = await findUserQueryHandler.handle(param);
        expect(Array.isArray(result.data) && result.data.length === list.length && result.pagination.total === 10).to.eq(true);
    });
});
