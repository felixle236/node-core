import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { GetRoleByIdQuery } from './GetRoleByIdQuery';
import { GetRoleByIdQueryHandler } from './GetRoleByIdQueryHandler';
import { IRole } from '../../../../domain/types/role/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../../domain/entities/role/Role';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('role.repository', {
    async getById() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const getRoleByIdQueryHandler = Container.get(GetRoleByIdQueryHandler);

const generateRole = () => {
    return new Role({ id: uuid.v4(), name: 'Role 1' } as IRole);
};

describe('Role - Get role by id', () => {
    const sandbox = createSandbox();
    let role: Role;

    beforeEach(() => {
        role = generateRole();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Get role by id without id', async () => {
        const param = new GetRoleByIdQuery();

        const result = await getRoleByIdQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Get role by id with data not found', async () => {
        sandbox.stub(roleRepository, 'getById').resolves(undefined);
        const param = new GetRoleByIdQuery();
        param.id = role.id;

        const result = await getRoleByIdQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_NOT_FOUND));
    });

    it('Get role by id successfully', async () => {
        sandbox.stub(roleRepository, 'getById').resolves(role);
        const param = new GetRoleByIdQuery();
        param.id = role.id;

        const result = await getRoleByIdQueryHandler.handle(param);
        expect(result).to.include({ id: role.id });
    });
});
