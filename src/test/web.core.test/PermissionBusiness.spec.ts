import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import { ClaimItem } from '../../web.core/dtos/permission/responses/ClaimItem';
import { ClaimResponse } from '../../web.core/dtos/permission/responses/ClaimResponse';
import { Container } from 'typedi';
import { IPermission } from '../../web.core/interfaces/models/IPermission';
import { IPermissionBusiness } from '../../web.core/interfaces/businesses/IPermissionBusiness';
import { IRole } from '../../web.core/interfaces/models/IRole';
import { Permission } from '../../web.core/models/Permission';
import { PermissionCreateRequest } from '../../web.core/dtos/permission/requests/PermissionCreateRequest';
import { PermissionRepository } from '../../web.infrastructure/data/typeorm/repositories/PermissionRepository';
import { Role } from '../../web.core/models/Role';
import { RoleClaim } from '../../constants/claims/RoleClaim';
import { RoleRepository } from '../../web.infrastructure/data/typeorm/repositories/RoleRepository';
import { SystemError } from '../../web.core/dtos/common/Exception';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

const generateRole = () => {
    return new Role({ id: 1, createdAt: new Date(), updatedAt: new Date(), name: 'Role 1', level: 1 } as IRole);
};

const generatePermissions = () => {
    return [
        new Permission({ id: 1, roleId: 1, role: generateRole().toData(), claim: RoleClaim.GET } as IPermission),
        new Permission({ id: 2, roleId: 1, role: generateRole().toData(), claim: RoleClaim.CREATE } as IPermission),
        new Permission({ id: 3, roleId: 1, role: generateRole().toData(), claim: RoleClaim.UPDATE } as IPermission),
        new Permission({ id: 4, roleId: 1, role: generateRole().toData(), claim: RoleClaim.DELETE } as IPermission)
    ];
};

const generatePermissionCreate = () => {
    const permissionCreate = new PermissionCreateRequest();
    permissionCreate.roleId = generateRole().id;
    permissionCreate.claim = RoleClaim.CREATE;

    return permissionCreate;
};

describe('Permission business testing', () => {
    const sandbox = createSandbox();
    const permissionBusiness = Container.get<IPermissionBusiness>('permission.business');
    let list: Permission[];

    beforeEach(() => {
        list = generatePermissions();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Get claims', async () => {
        const claimView = new ClaimResponse('SystemClaim');
        const claimItem = new ClaimItem();
        claimView.items.push(claimItem);
        claimItem.code = 1201;
        claimItem.name = 'INIT_DATA';
        sandbox.stub(PermissionRepository.prototype, 'getClaims').resolves([claimView]);

        const results = await permissionBusiness.getClaims();
        expect(Array.isArray(results) && results.length && results[0].items.length && results[0].name === claimView.name && results[0].items[0].code === claimView.items[0].code).to.eq(true);
    });

    it('Get all permissions successfull without user authenticated', async () => {
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves(list);

        const permissions = await permissionBusiness.getAllByRole(list[0].roleId);
        expect(Array.isArray(permissions) && permissions.length > 0).to.eq(true);
    });

    it('Get all permissions by role is not exist', async () => {
        const role = generateRole();
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves(list);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        const userAuth = new UserAuthenticated();

        await permissionBusiness.getAllByRole(1000, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'role').message);
        });
    });

    it('Get all permissions by role with access denied', async () => {
        const role = generateRole();
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves(list);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await permissionBusiness.getAllByRole(list[0].roleId, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Get all permissions by role', async () => {
        const role = generateRole();
        role.level = 2;
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves(list);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 1;

        const permissions = await permissionBusiness.getAllByRole(list[0].roleId, userAuth);
        expect(Array.isArray(permissions) && permissions.length > 0).to.eq(true);
    });

    it('Get permission by id with access denied', async () => {
        const item = list[0];
        sandbox.stub(PermissionRepository.prototype, 'getById').resolves(item);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        const permission = await permissionBusiness.getById(item.id, userAuth);
        expect(permission).to.eq(undefined);
    });

    it('Get permission by id successfully', async () => {
        const item = list[0];
        sandbox.stub(PermissionRepository.prototype, 'getById').resolves(item);

        const permission = await permissionBusiness.getById(item.id);
        expect(!!permission).to.eq(true);
    });

    it('Create new permission without role', async () => {
        const permissionCreate = generatePermissionCreate();
        delete permissionCreate.roleId;

        await permissionBusiness.create(permissionCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'role id').message);
        });
    });

    it('Create new permission with an invalid role id', async () => {
        const permissionCreate = generatePermissionCreate();
        permissionCreate.roleId = 0;

        await permissionBusiness.create(permissionCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'role id').message);
        });
    });

    it('Create new permission without claim', async () => {
        const permissionCreate = generatePermissionCreate();
        delete permissionCreate.claim;

        await permissionBusiness.create(permissionCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'claim').message);
        });
    });

    it('Create new permission with an invalid claim', async () => {
        const permissionCreate = generatePermissionCreate();
        permissionCreate.claim = 0;

        await permissionBusiness.create(permissionCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'claim').message);
        });
    });

    it('Create new permission with role is not exists', async () => {
        sandbox.stub(RoleRepository.prototype, 'getById').resolves();
        const permissionCreate = generatePermissionCreate();
        permissionCreate.claim = 1;

        await permissionBusiness.create(permissionCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'role').message);
        });
    });

    it('Create new permission with access denied', async () => {
        const role = generateRole();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        const permissionCreate = generatePermissionCreate();
        permissionCreate.claim = 1;
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await permissionBusiness.create(permissionCreate, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Create new permission with data duplicated', async () => {
        const role = generateRole();
        const permissionCreate = generatePermissionCreate();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves(list);
        permissionCreate.roleId = list[0].roleId;
        permissionCreate.claim = list[0].claim;

        await permissionBusiness.create(permissionCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1005, 'permission').message);
        });
    });

    it('Create new permission with cannot save error', async () => {
        const role = generateRole();
        const permissionCreate = generatePermissionCreate();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves([]);
        sandbox.stub(PermissionRepository.prototype, 'create').resolves();

        await permissionBusiness.create(permissionCreate).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Create new permission successfully', async () => {
        const role = generateRole();
        const permission = list[0];
        const permissionCreate = generatePermissionCreate();
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves([]);
        sandbox.stub(PermissionRepository.prototype, 'create').resolves(permission.id);
        sandbox.stub(PermissionRepository.prototype, 'clearCaching').resolves();
        sandbox.stub(PermissionRepository.prototype, 'getById').resolves(permission);

        const result = await permissionBusiness.create(permissionCreate);
        expect(result && result.id === permission.id).to.eq(true);
    });

    it('Delete permission with id not exists', async () => {
        sandbox.stub(PermissionRepository.prototype, 'getById').resolves(undefined);

        await permissionBusiness.delete(1).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'permission').message);
        });
    });

    it('Delete permission with access denied', async () => {
        const item = list[0];
        sandbox.stub(PermissionRepository.prototype, 'getById').resolves(item);
        const userAuth = new UserAuthenticated();
        userAuth.role = new Role();
        userAuth.role.level = 2;

        await permissionBusiness.delete(item.id, userAuth).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3).message);
        });
    });

    it('Delete permission successfully', async () => {
        const item = list[0];
        sandbox.stub(PermissionRepository.prototype, 'getById').resolves(item);
        sandbox.stub(PermissionRepository.prototype, 'delete').resolves(true);
        sandbox.stub(PermissionRepository.prototype, 'clearCaching').resolves();

        const hasSucceed = await permissionBusiness.delete(item.id);
        expect(hasSucceed).to.eq(true);
    });
});
