import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { FindRoleQuery } from './FindRoleQuery';
import { FindRoleQueryHandler } from './FindRoleQueryHandler';
import { IRole } from '../../../../domain/types/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../../domain/entities/Role';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('role.repository', {
    async findAndCount() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const findRoleQueryHandler = Container.get(FindRoleQueryHandler);

const generateRoles = () => {
    return [
        new Role({ id: uuid.v4(), name: 'Role 1', level: 1 } as IRole),
        new Role({ id: uuid.v4(), name: 'Role 2', level: 2 } as IRole),
        new Role({ id: uuid.v4(), name: 'Role 3', level: 3 } as IRole)
    ];
};

describe('Role - Find roles', () => {
    const sandbox = createSandbox();
    let list: Role[];

    beforeEach(() => {
        list = generateRoles();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Find roles without permission', async () => {
        const param = new FindRoleQuery();

        const result = await findRoleQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Find roles successfully', async () => {
        sandbox.stub(roleRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindRoleQuery();
        param.roleAuthLevel = 1;

        const result = await findRoleQueryHandler.handle(param);
        expect(Array.isArray(result.data) && result.data.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find roles successfully with params', async () => {
        sandbox.stub(roleRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindRoleQuery();
        param.roleAuthLevel = 1;
        param.keyword = 'test';

        const result = await findRoleQueryHandler.handle(param);
        expect(Array.isArray(result.data) && result.data.length === list.length && result.pagination.total === 10).to.eq(true);
    });
});
