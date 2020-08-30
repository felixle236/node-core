import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { IRole } from '../../../../domain/types/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../../domain/entities/Role';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateRoleCommand } from './UpdateRoleCommand';
import { UpdateRoleCommandHandler } from './UpdateRoleCommandHandler';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('role.repository', {
    async getById() {},
    async checkNameExist() {},
    async update() {},
    async clearCaching() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const updateRoleCommandHandler = Container.get(UpdateRoleCommandHandler);

const generateRole = () => {
    return new Role({ id: uuid.v4(), name: 'Role 1', level: 1 } as IRole);
};

describe('Role - Update role', () => {
    const sandbox = createSandbox();
    let role: Role;

    beforeEach(() => {
        role = generateRole();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Update role without id', async () => {
        const param = new UpdateRoleCommand();

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'id'));
    });

    it('Update role without permission', async () => {
        const param = new UpdateRoleCommand();
        param.id = role.id;

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Update role without name', async () => {
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'name'));
    });

    it('Update role with length name greater than 50 characters', async () => {
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'This is the name with length greater than 50 characters!';

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50));
    });

    it('Update role without level', async () => {
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'Role test';

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'level'));
    });

    it('Update role with invalid level', async () => {
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'Role test';
        param.level = -1;

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'level'));
    });

    it('Update role with level greater than 100', async () => {
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'Role test';
        param.level = 1000;

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'level', 100));
    });

    it('Update role with role is not exists', async () => {
        sandbox.stub(roleRepository, 'getById').resolves(undefined);
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'Role test';
        param.level = 1;

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_EXISTS, 'role'));
    });

    it('Update role with access denied', async () => {
        sandbox.stub(roleRepository, 'getById').resolves(role);
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'Role test';
        param.level = 1;

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.ACCESS_DENIED));
    });

    it('Update role with name has exists', async () => {
        role.level = 2;
        sandbox.stub(roleRepository, 'getById').resolves(role);
        sandbox.stub(roleRepository, 'checkNameExist').resolves(true);
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'Role test';
        param.level = 2;

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXISTED, 'name'));
    });

    it('Update role with data cannot save', async () => {
        role.level = 2;
        sandbox.stub(roleRepository, 'getById').resolves(role);
        sandbox.stub(roleRepository, 'checkNameExist').resolves(false);
        sandbox.stub(roleRepository, 'update').resolves(false);
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'Role test';
        param.level = 2;

        const result = await updateRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Update role successfully', async () => {
        role.level = 2;
        sandbox.stub(roleRepository, 'getById').resolves(role);
        sandbox.stub(roleRepository, 'checkNameExist').resolves(false);
        sandbox.stub(roleRepository, 'update').resolves(true);
        sandbox.stub(roleRepository, 'clearCaching').resolves();
        const param = new UpdateRoleCommand();
        param.roleAuthLevel = 1;
        param.id = role.id;
        param.name = 'Role test';
        param.level = 2;

        const hasSucceed = await updateRoleCommandHandler.handle(param);
        expect(hasSucceed).to.eq(true);
    });
});
