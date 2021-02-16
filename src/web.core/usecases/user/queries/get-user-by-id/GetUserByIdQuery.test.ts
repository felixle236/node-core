import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { GetUserByIdQuery } from './GetUserByIdQuery';
import { GetUserByIdQueryHandler } from './GetUserByIdQueryHandler';
import { AccessDeniedError } from '../../../../domain/common/exceptions/AccessDeniedError';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IRole } from '../../../../domain/types/role/IRole';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

Container.set('user.repository', {
    async getById() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const getUserByIdQueryHandler = Container.get(GetUserByIdQueryHandler);

const roleData = { id: RoleId.MANAGER, name: 'Role 2' } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com', birthday: new Date() } as IUser);
};

describe('User - Get user by id', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Get user by id without id', async () => {
        const param = new GetUserByIdQuery();

        const result = await getUserByIdQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Get user by id without permission', async () => {
        const param = new GetUserByIdQuery();
        param.id = user.id;

        const result = await getUserByIdQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Get user by id with data not found', async () => {
        sandbox.stub(userRepository, 'getById').resolves(null);
        const param = new GetUserByIdQuery();
        param.roleAuthId = RoleId.SUPER_ADMIN;
        param.id = user.id;

        const result = await getUserByIdQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_NOT_FOUND));
    });

    it('Get user by id with access denied', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        const param = new GetUserByIdQuery();
        param.roleAuthId = RoleId.CLIENT;
        param.id = user.id;

        const result = await getUserByIdQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new AccessDeniedError());
    });

    it('Get user by id successfully', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        const param = new GetUserByIdQuery();
        param.roleAuthId = RoleId.SUPER_ADMIN;
        param.id = user.id;

        const result = await getUserByIdQueryHandler.handle(param);
        expect(result).to.include({ id: user.id });
    });
});
