import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { DeleteRoleCommand } from './DeleteRoleCommand';
import { DeleteRoleCommandHandler } from './DeleteRoleCommandHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { Role } from '../../../../domain/entities/role/Role';
import { IRole } from '../../../../domain/types/role/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';

Container.set('role.repository', {
    async getById() {},
    async delete() {},
    async clearCaching() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const deleteRoleCommandHandler = Container.get(DeleteRoleCommandHandler);

const generateRole = () => {
    return new Role({ id: uuid.v4(), name: 'Role 1' } as IRole);
};

describe('Role - Delete role', () => {
    const sandbox = createSandbox();
    let role: Role;

    beforeEach(() => {
        role = generateRole();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Delete role without id', async () => {
        const param = new DeleteRoleCommand();

        const result = await deleteRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Delete role with role is not exists', async () => {
        sandbox.stub(roleRepository, 'getById').resolves(undefined);
        const param = new DeleteRoleCommand();
        param.id = role.id;

        const result = await deleteRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_EXISTS, 'role'));
    });

    it('Delete role with data cannot save', async () => {
        sandbox.stub(roleRepository, 'getById').resolves(role);
        sandbox.stub(roleRepository, 'delete').resolves(false);
        const param = new DeleteRoleCommand();
        param.id = role.id;

        const result = await deleteRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Delete role successfully', async () => {
        sandbox.stub(roleRepository, 'getById').resolves(role);
        sandbox.stub(roleRepository, 'delete').resolves(true);
        sandbox.stub(roleRepository, 'clearCaching').resolves();
        const param = new DeleteRoleCommand();
        param.id = role.id;

        const hasSucceed = await deleteRoleCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
