import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { FindRoleCommonQuery } from './FindRoleCommonQuery';
import { FindRoleCommonQueryHandler } from './FindRoleCommonQueryHandler';
import { IRole } from '../../../../domain/types/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { Role } from '../../../../domain/entities/Role';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('role.repository', {
    async findCommonAndCount() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const findRoleCommonQueryHandler = Container.get(FindRoleCommonQueryHandler);

const generateRoles = () => {
    return [
        new Role({ id: uuid.v4(), name: 'Role 1' } as IRole),
        new Role({ id: uuid.v4(), name: 'Role 2' } as IRole),
        new Role({ id: uuid.v4(), name: 'Role 3' } as IRole)
    ];
};

describe('Role - Find roles common', () => {
    const sandbox = createSandbox();
    let list: Role[];

    beforeEach(() => {
        list = generateRoles();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Find roles common successfully', async () => {
        sandbox.stub(roleRepository, 'findCommonAndCount').resolves([list, 10]);
        const param = new FindRoleCommonQuery();

        const result = await findRoleCommonQueryHandler.handle(param);
        expect(Array.isArray(result.data) && result.data.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find roles common successfully with params', async () => {
        sandbox.stub(roleRepository, 'findCommonAndCount').resolves([list, 10]);
        const param = new FindRoleCommonQuery();
        param.keyword = 'test';

        const result = await findRoleCommonQueryHandler.handle(param);
        expect(Array.isArray(result.data) && result.data.length === list.length && result.pagination.total === 10).to.eq(true);
    });
});
