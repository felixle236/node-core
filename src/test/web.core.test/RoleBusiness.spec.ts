import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import { Container } from 'typedi';
import { IRole } from '../../web.core/gateways/models/IRole';
import { IRoleBusiness } from '../../web.core/gateways/businesses/IRoleBusiness';
import { Role } from '../../web.core/models/Role';
import { RoleCommonFilterRequest } from '../../web.core/dtos/role/requests/RoleCommonFilterRequest';
import { RoleCreateRequest } from '../../web.core/dtos/role/requests/RoleCreateRequest';
import { RoleFilterRequest } from '../../web.core/dtos/role/requests/RoleFilterRequest';
import { RoleRepository } from '../../web.infrastructure/data/typeorm/repositories/RoleRepository';
import { RoleUpdateRequest } from '../../web.core/dtos/role/requests/RoleUpdateRequest';
import { SystemError } from '../../web.core/dtos/common/Exception';
import { UserAuthenticated } from '../../web.core/dtos/common/UserAuthenticated';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

const generateRoles = () => {
    return [
        new Role({ id: 1, createdAt: new Date(), updatedAt: new Date(), name: 'Role 1', level: 1 } as IRole),
        new Role({ id: 2, createdAt: new Date(), updatedAt: new Date(), name: 'Role 2', level: 2 } as IRole),
        new Role({ id: 3, createdAt: new Date(), updatedAt: new Date(), name: 'Role 3', level: 3 } as IRole)
    ];
};

const generateUserAuth = () => {
    const userAuth = new UserAuthenticated();
    userAuth.userId = 1;
    userAuth.role = new Role();
    userAuth.role.level = 1;
    return userAuth;
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
        const userAuth = generateUserAuth();

        const result = await roleBusiness.find(new RoleFilterRequest(), userAuth);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find roles with name param', async () => {
        sandbox.stub(RoleRepository.prototype, 'find').resolves([list, 10]);
        const userAuth = generateUserAuth();

        const filter = new RoleFilterRequest();
        filter.keyword = 'role';

        const result = await roleBusiness.find(filter, userAuth);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find common roles without param items', async () => {
        sandbox.stub(RoleRepository.prototype, 'findCommon').resolves([list, 10]);
        const userAuth = generateUserAuth();

        const result = await roleBusiness.findCommon(new RoleCommonFilterRequest(), userAuth);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Find common roles with name param', async () => {
        sandbox.stub(RoleRepository.prototype, 'findCommon').resolves([list, 10]);
        const userAuth = generateUserAuth();

        const filter = new RoleCommonFilterRequest();
        filter.keyword = 'role';

        const result = await roleBusiness.findCommon(filter, userAuth);
        expect(Array.isArray(result.results) && result.results.length === list.length && result.pagination.total === 10).to.eq(true);
    });

    it('Get role by id with access denied', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        const userAuth = generateUserAuth();
        userAuth.role.level = 2;

        const data = await roleBusiness.getById(item.id, userAuth);
        expect(data).to.eq(undefined);
    });

    it('Get role by id', async () => {
        const item = list[1];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        const userAuth = generateUserAuth();

        const result = await roleBusiness.getById(item.id, userAuth);
        expect(result && result.id === item.id).to.eq(true);
    });

    it('Create new role without name', async () => {
        const userAuth = generateUserAuth();
        const roleCreate = generateRoleCreate();
        roleCreate.name = '';

        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_REQUIRED, 'name').message);
        });
    });

    it('Create new role with an invalid name', async () => {
        const userAuth = generateUserAuth();
        const roleCreate = generateRoleCreate();
        roleCreate.name = 123 as any;

        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'name').message);
        });
    });

    it('Create new role with length name greater than 50 characters', async () => {
        const userAuth = generateUserAuth();
        const roleCreate = generateRoleCreate();
        roleCreate.name = 'This is the name with length greater than 50 characters!';

        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50).message);
        });
    });

    it('Create new role without level', async () => {
        const userAuth = generateUserAuth();
        const roleCreate = generateRoleCreate();
        delete roleCreate.level;

        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_REQUIRED, 'level').message);
        });
    });

    it('Create new role with an invalid level', async () => {
        const userAuth = generateUserAuth();
        const roleCreate = generateRoleCreate();
        roleCreate.level = 0;

        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'level').message);
        });
    });

    it('Create new role with level greater than 100', async () => {
        const userAuth = generateUserAuth();
        const roleCreate = generateRoleCreate();
        roleCreate.level = 101;

        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'level', 100).message);
        });
    });

    it('Create new role with access denied', async () => {
        const roleCreate = generateRoleCreate();
        const userAuth = generateUserAuth();
        userAuth.role.level = 3;

        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.ACCESS_DENIED).message);
        });
    });

    it('Create new role with name has exists', async () => {
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(true);
        const userAuth = generateUserAuth();

        const roleCreate = generateRoleCreate();
        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_EXISTED, 'name').message);
        });
    });

    it('Create new role with cannot save error', async () => {
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'create').resolves();

        const roleCreate = generateRoleCreate();
        await roleBusiness.create(roleCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.DATA_CANNOT_SAVE).message);
        });
    });

    it('Create new role successfully', async () => {
        const role = list[0];
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'create').resolves(role.id);
        sandbox.stub(RoleRepository.prototype, 'clearCaching').resolves();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);

        const roleCreate = generateRoleCreate();
        const data = await roleBusiness.create(roleCreate, userAuth);
        expect(data && data.id === role.id).to.eq(true);
    });

    it('Update role with id not exists', async () => {
        const userAuth = generateUserAuth();
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(undefined);

        const roleUpdate = generateRoleUpdate();
        await roleBusiness.update(item.id, roleUpdate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_NOT_EXISTS, 'role').message);
        });
    });

    it('Update role with access denied', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        const userAuth = generateUserAuth();
        userAuth.role.level = 2;

        const roleUpdate = generateRoleUpdate();
        await roleBusiness.update(item.id, roleUpdate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.ACCESS_DENIED).message);
        });
    });

    it('Update role without name', async () => {
        const item = list[1];
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);

        const roleUpdate = generateRoleUpdate();
        roleUpdate.name = '';

        await roleBusiness.update(item.id, roleUpdate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_REQUIRED, 'name').message);
        });
    });

    it('Update role with length name greater than 50 characters', async () => {
        const item = list[1];
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);

        const roleUpdate = generateRoleUpdate();
        roleUpdate.name = 'This is the name with length greater than 50 characters!';

        await roleBusiness.update(item.id, roleUpdate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 50).message);
        });
    });

    it('Update role with name has exists', async () => {
        const item = list[1];
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(true);

        const roleUpdate = generateRoleUpdate();
        roleUpdate.name = item.name;

        await roleBusiness.update(item.id, roleUpdate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_EXISTED, 'name').message);
        });
    });

    it('Update role with cannot save error', async () => {
        const item = list[1];
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'update').resolves(false);

        const roleUpdate = generateRoleUpdate();
        await roleBusiness.update(item.id, roleUpdate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.DATA_CANNOT_SAVE).message);
        });
    });

    it('Update role successfully', async () => {
        const item = list[1];
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'checkNameExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'update').resolves(true);
        sandbox.stub(RoleRepository.prototype, 'clearCaching').resolves();

        const roleUpdate = generateRoleUpdate();
        const result = await roleBusiness.update(item.id, roleUpdate, userAuth);
        expect(result && result.id === item.id).to.eq(true);
    });

    it('Delete role with id not exists', async () => {
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(undefined);

        await roleBusiness.delete(10, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_NOT_EXISTS, 'role').message);
        });
    });

    it('Delete role with access denied', async () => {
        const item = list[0];
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        const userAuth = generateUserAuth();
        userAuth.role.level = 2;

        await roleBusiness.delete(item.id, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.ACCESS_DENIED).message);
        });
    });

    it('Delete role with cannot save error', async () => {
        const item = list[1];
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'delete').resolves(false);

        await roleBusiness.delete(item.id, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.DATA_CANNOT_SAVE).message);
        });
    });

    it('Delete role successfully', async () => {
        const item = list[1];
        const userAuth = generateUserAuth();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(item);
        sandbox.stub(RoleRepository.prototype, 'delete').resolves(true);
        sandbox.stub(RoleRepository.prototype, 'clearCaching').resolves();

        const hasSucceed = await roleBusiness.delete(item.id, userAuth);
        expect(hasSucceed).to.eq(true);
    });
});
