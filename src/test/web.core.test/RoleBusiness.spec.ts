import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import { Container } from 'typedi';
import { IRole } from '../../web.core/interfaces/models/IRole';
import { IRoleBusiness } from '../../web.core/interfaces/businesses/IRoleBusiness';
import { Role } from '../../web.core/models/Role';
import { RoleCommonFilterRequest } from '../../web.core/dtos/role/requests/RoleCommonFilterRequest';
import { RoleCreateRequest } from '../../web.core/dtos/role/requests/RoleCreateRequest';
import { RoleFilterRequest } from '../../web.core/dtos/role/requests/RoleFilterRequest';
import { RoleRepository } from '../../web.infrastructure/data/typeorm/repositories/RoleRepository';
import { RoleUpdateRequest } from '../../web.core/dtos/role/requests/RoleUpdateRequest';
import { SystemError } from '../../web.core/dtos/common/Exception';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

const generateRoles = () => {
    return [
        new Role({ id: 1, createdAt: new Date(), updatedAt: new Date(), name: 'Role 1', level: 1 } as IRole),
        new Role({ id: 2, createdAt: new Date(), updatedAt: new Date(), name: 'Role 2', level: 2 } as IRole),
        new Role({ id: 3, createdAt: new Date(), updatedAt: new Date(), name: 'Role 3', level: 3 } as IRole)
    ];
};

const generateRoleCreate = () => {
    const roleCreate = new RoleCreateRequest();
    roleCreate.name = 'Test';
    roleCreate.level = 2;

    return roleCreate;
};

const generateRoleUpdate = () => {
    const roleUpdate = new RoleUpdateRequest();
    roleUpdate.name = 'Test';
    roleUpdate.level = 2;

    return roleUpdate;
};

describe('Role business testing', () => {
    const sandbox = createSandbox();
    const roleBusiness = Container.get<IRoleBusiness>('role.business');
    let list: Role[];

    beforeEach(() => {
        list = generateRoles();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Find roles without param items', async () => {
        sandbox.stub(RoleRepository.prototype, 'find').resolves([list, 10]);

        const result = await roleBusiness.find(new RoleFilterRequest());
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find roles with name param', async () => {
        sandbox.stub(RoleRepository.prototype, 'find').resolves([list, 10]);

        const filter = new RoleFilterRequest();
        filter.keyword = 'role';

        const result = await roleBusiness.find(filter);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find common roles without param items', async () => {
        sandbox.stub(RoleRepository.prototype, 'findCommon').resolves([list, 10]);

        const result = await roleBusiness.findCommon(new RoleCommonFilterRequest());
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find common roles with name param', async () => {
        sandbox.stub(RoleRepository.prototype, 'findCommon').resolves([list, 10]);

        const filter = new RoleCommonFilterRequest();
        filter.keyword = 'role';

        const result = await roleBusiness.findCommon(filter);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Get role by id with access denied', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        const data = await roleBusiness.getById(item.id, userAuth);
        expect(data).to.eq(undefined);
    });

    it('Get role by id', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);

        const result = await roleBusiness.getById(item.id);
        expect(result && result.id === item.id).to.eq(true);
    });

    it('Create new role without name', async () => {
        const roleCreate = generateRoleCreate();
        roleCreate.name = '';

        await roleBusiness.create(roleCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'name').message);
        });
    });

    it('Create new role with an invalid name', async () => {
        const roleCreate = generateRoleCreate();
        roleCreate.name = 123 as any;

        await roleBusiness.create(roleCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'name').message);
        });
    });

    it('Create new role with length name greater than 50 characters', async () => {
        const roleCreate = generateRoleCreate();
        roleCreate.name = 'This is the name with length greater than 50 characters!';

        await roleBusiness.create(roleCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'name', 50).message);
        });
    });

    it('Create new role without level', async () => {
        const roleCreate = generateRoleCreate();
        delete roleCreate.level;

        await roleBusiness.create(roleCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'level').message);
        });
    });

    it('Create new role with an invalid level', async () => {
        const roleCreate = generateRoleCreate();
        roleCreate.level = 0;

        await roleBusiness.create(roleCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'level').message);
        });
    });

    it('Create new role with level greater than 100', async () => {
        const roleCreate = generateRoleCreate();
        roleCreate.level = 101;

        await roleBusiness.create(roleCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'level', 100).message);
        });
    });

    it('Create new role with access denied', async () => {
        const roleCreate = generateRoleCreate();
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 3;

        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Create new role with name has exists', async () => {
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 1;
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(true);

        const roleCreate = generateRoleCreate();
        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1005, 'name').message);
        });
    });

    it('Create new role with cannot save error', async () => {
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 1;
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'create').resolves();

        const roleCreate = generateRoleCreate();
        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Create new role successfully', async () => {
        const role = list[0];
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 1;
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'create').resolves(role.id);
        sandbox.stub(RoleRepository.prototype, 'clearCaching').resolves();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);

        const roleCreate = generateRoleCreate();
        const data = await roleBusiness.create(roleCreate, userAuth);
        expect(data && data.id === role.id).to.eq(true);
    });

    it('Update role with id not exists', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(undefined);

        const roleUpdate = generateRoleUpdate();
        await roleBusiness.update(item.id, roleUpdate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'role').message);
        });
    });

    it('Update role with access denied', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        const roleUpdate = generateRoleUpdate();
        await roleBusiness.update(item.id, roleUpdate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Update role without name', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);

        const roleUpdate = generateRoleUpdate();
        roleUpdate.name = '';

        await roleBusiness.update(item.id, roleUpdate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'name').message);
        });
    });

    it('Update role with length name greater than 50 characters', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);

        const roleUpdate = generateRoleUpdate();
        roleUpdate.name = 'This is the name with length greater than 50 characters!';

        await roleBusiness.update(item.id, roleUpdate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'name', 50).message);
        });
    });

    it('Update role with name has exists', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(true);

        const roleUpdate = generateRoleUpdate();
        roleUpdate.name = item.name;

        await roleBusiness.update(item.id, roleUpdate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1005, 'name').message);
        });
    });

    it('Update role with cannot save error', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'update').resolves(false);

        const roleUpdate = generateRoleUpdate();
        await roleBusiness.update(item.id, roleUpdate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Update role successfully', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'update').resolves(true);
        sandbox.stub(RoleRepository.prototype, 'clearCaching').resolves();

        const roleUpdate = generateRoleUpdate();
        const result = await roleBusiness.update(item.id, roleUpdate);
        expect(result && result.id === item.id).to.eq(true);
    });

    it('Delete role with id not exists', async () => {
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(undefined);

        await roleBusiness.delete(10).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'role').message);
        });
    });

    it('Delete role with access denied', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await roleBusiness.delete(item.id, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Delete role with cannot save error', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'delete').resolves(false);

        await roleBusiness.delete(item.id).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Delete role successfully', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'delete').resolves(true);
        sandbox.stub(RoleRepository.prototype, 'clearCaching').resolves();

        const result = await roleBusiness.delete(item.id);
        expect(result).to.eq(true);
    });
});
