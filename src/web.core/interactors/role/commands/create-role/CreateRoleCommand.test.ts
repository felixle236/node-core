import 'reflect-metadata';
import 'mocha';
import * as uuid from 'uuid';
import { Container } from 'typedi';
import { CreateRoleCommand } from './CreateRoleCommand';
import { CreateRoleCommandHandler } from './CreateRoleCommandHandler';
import { IRole } from '../../../../domain/types/role/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../../domain/entities/role/Role';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('role.repository', {
    async checkNameExist() {},
    async create() {},
    async clearCaching() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const createRoleCommandHandler = Container.get(CreateRoleCommandHandler);

const generateRole = () => {
    return new Role({ id: uuid.v4(), name: 'Role 1' } as IRole);
};

describe('Role - Create role', () => {
    const sandbox = createSandbox();
    let role: Role;

    beforeEach(() => {
        role = generateRole();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Create role without name', async () => {
        const param = new CreateRoleCommand();

        const result = await createRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'name'));
    });

    it('Create role with length name greater than 50 characters', async () => {
        const param = new CreateRoleCommand();
        param.name = 'This is the name with length greater than 50 characters!';

        const result = await createRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50));
    });

    it('Create role with name has exists', async () => {
        sandbox.stub(roleRepository, 'checkNameExist').resolves(true);
        const param = new CreateRoleCommand();
        param.name = 'Role test';

        const result = await createRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_EXISTED, 'name'));
    });

    it('Create role with data cannot save', async () => {
        sandbox.stub(roleRepository, 'checkNameExist').resolves(false);
        sandbox.stub(roleRepository, 'create').resolves(undefined);
        const param = new CreateRoleCommand();
        param.name = 'Role test';

        const result = await createRoleCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE));
    });

    it('Create role successfully', async () => {
        sandbox.stub(roleRepository, 'checkNameExist').resolves(false);
        sandbox.stub(roleRepository, 'create').resolves(role.id);
        sandbox.stub(roleRepository, 'clearCaching').resolves();
        const param = new CreateRoleCommand();
        param.name = 'Role test';

        const id = await createRoleCommandHandler.handle(param);
        expect(id).to.eq(role.id);
    });
});
