import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { GetMyProfileQuery } from './GetMyProfileQuery';
import { GetMyProfileQueryHandler } from './GetMyProfileQueryHandler';
import { IRole } from '../../../../domain/types/IRole';
import { IUser } from '../../../../domain/types/IUser';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { RoleId } from '../../../../domain/enums/RoleId';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('user.repository', {
    async getById() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const getMyProfileQueryHandler = Container.get(GetMyProfileQueryHandler);

const roleData = { id: RoleId.SUPER_ADMIN, name: 'Role 1' } as IRole;
const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), updatedAt: new Date(), roleId: roleData.id, role: roleData, firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Get my profile', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Get user by id without id', async () => {
        const param = new GetMyProfileQuery();

        const result = await getMyProfileQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Get user by id with data not found', async () => {
        sandbox.stub(userRepository, 'getById').resolves(undefined);
        const param = new GetMyProfileQuery();
        param.id = user.id;

        const result = await getMyProfileQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_NOT_FOUND));
    });

    it('Get user by id successfully', async () => {
        sandbox.stub(userRepository, 'getById').resolves(user);
        const param = new GetMyProfileQuery();
        param.id = user.id;

        const result = await getMyProfileQueryHandler.handle(param);
        expect(result).to.include({ id: user.id });
    });
});
