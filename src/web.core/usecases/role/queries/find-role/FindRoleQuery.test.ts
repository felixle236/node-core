import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { FindRoleQuery } from './FindRoleQuery';
import { FindRoleQueryHandler } from './FindRoleQueryHandler';
import { Role } from '../../../../domain/entities/role/Role';
import { IRole } from '../../../../domain/types/role/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';

Container.set('role.repository', {
    async findAndCount() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const findRoleQueryHandler = Container.get(FindRoleQueryHandler);

const generateRoles = () => {
    return [
        new Role({ id: uuid.v4(), name: 'Role 1' } as IRole),
        new Role({ id: uuid.v4(), name: 'Role 2' } as IRole),
        new Role({ id: uuid.v4(), name: 'Role 3' } as IRole)
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

    it('Find roles successfully', async () => {
        sandbox.stub(roleRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindRoleQuery();

        const result = await findRoleQueryHandler.handle(param);
        expect(Array.isArray(result.data) && result.data.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find roles successfully with params', async () => {
        sandbox.stub(roleRepository, 'findAndCount').resolves([list, 10]);
        const param = new FindRoleQuery();
        param.keyword = 'test';

        const result = await findRoleQueryHandler.handle(param);
        expect(Array.isArray(result.data) && result.data.length === list.length && result.pagination.total === 10).to.eq(true);
    });
});
