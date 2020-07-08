import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as requestPromise from 'request-promise';
import { SinonSandbox, createSandbox } from 'sinon';
import { mapModel, mapModels } from '../../libs/common';
import { ApiService } from '../../web.api/ApiService';
import { AuthenticationBusiness } from '../../web.core/businesses/AuthenticationBusiness';
import { IRole } from '../../web.core/interfaces/models/IRole';
import { Response } from 'request';
import { ResultListResponse } from '../../web.core/dtos/common/ResultListResponse';
import { Role } from '../../web.core/models/Role';
import { RoleBusiness } from '../../web.core/businesses/RoleBusiness';
import { RoleCommonResponse } from '../../web.core/dtos/role/responses/RoleCommonResponse';
import { RoleCreateRequest } from '../../web.core/dtos/role/requests/RoleCreateRequest';
import { RoleResponse } from '../../web.core/dtos/role/responses/RoleResponse';
import { RoleUpdateRequest } from '../../web.core/dtos/role/requests/RoleUpdateRequest';
import { Server } from 'http';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { expect } from 'chai';

const generateUserAuth = () => {
    const userAuth = new UserAuthenticated();
    userAuth.id = 1;
    userAuth.role = new Role({ id: 1 } as any);
    userAuth.accessToken = 'access-token';
    return userAuth;
};

const generateRoleDTOs = () => {
    return [
        new Role({ id: 1, createdAt: new Date(), updatedAt: new Date(), name: 'Role 1', level: 1 } as IRole),
        new Role({ id: 2, createdAt: new Date(), updatedAt: new Date(), name: 'Role 2', level: 2 } as IRole),
        new Role({ id: 3, createdAt: new Date(), updatedAt: new Date(), name: 'Role 3', level: 3 } as IRole)
    ];
};

const generateRoleCreate = () => {
    const roleCreate = new RoleCreateRequest();
    roleCreate.name = 'Test';
    roleCreate.level = 1;

    return roleCreate;
};

const generateRoleUpdate = () => {
    const roleUpdate = new RoleUpdateRequest();
    roleUpdate.name = 'Test';
    roleUpdate.level = 1;

    return roleUpdate;
};

describe('Role controller testing', () => {
    let sandbox: SinonSandbox;
    let server: Server;
    const port = 3000;
    const url = `http://localhost:${port}/api/v1/roles`;
    const headers = {};
    headers['Content-Type'] = 'application/json';
    const request = requestPromise.defaults({ headers, json: true });
    let userAuth: UserAuthenticated;
    let list: Role[];

    before(function(done) {
        this.timeout(6000);
        sandbox = createSandbox();
        server = ApiService.start(done);
    });

    beforeEach(() => {
        userAuth = generateUserAuth();
        list = generateRoleDTOs();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        server.close(done);
    });

    it('Find roles without permission', async () => {
        await request.get(url).catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Find roles', async () => {
        const resultList = new ResultListResponse(mapModels(RoleResponse, list), list.length, 0, 10);
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(RoleBusiness.prototype, 'find').resolves(resultList);

        const { data } = await request.get(url);
        expect(data.pagination && data.results && Array.isArray(data.results) && data.results.length === resultList.results.length).to.eq(true);
    });

    it('Find common roles without permission', async () => {
        await request.get(url + '/common').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Find common roles', async () => {
        const resultList = new ResultListResponse(mapModels(RoleCommonResponse, list), list.length, 0, 10);
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(RoleBusiness.prototype, 'findCommon').resolves(resultList);

        const { data } = await request.get(url + '/common');
        expect(data.pagination && data.results && Array.isArray(data.results) && data.results.length === resultList.results.length).to.eq(true);
    });

    it('Get role by id without permission', async () => {
        await request.get(url + '/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Get role by id', async () => {
        const role = list[0];
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(RoleBusiness.prototype, 'getById').resolves(mapModel(RoleResponse, role));

        const { data } = await request.get(url + '/1');
        expect(data && data.id === role.id).to.eq(true);
    });

    it('Create role without permission', async () => {
        await request.post(url).catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Create role successfully', async () => {
        const role = list[0];
        const roleCreate = generateRoleCreate();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(RoleBusiness.prototype, 'create').resolves(mapModel(RoleResponse, role));

        const { data } = await request.post(url, { body: roleCreate });
        expect(data && data.id === role.id).to.eq(true);
    });

    it('Update role without permission', async () => {
        await request.put(url + '/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Update role successfully', async () => {
        const role = list[0];
        const roleUpdate = generateRoleUpdate();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(RoleBusiness.prototype, 'update').resolves(mapModel(RoleResponse, role));

        const { data } = await request.put(url + '/1', { body: roleUpdate });
        expect(data && data.id === role.id).to.eq(true);
    });

    it('Delete role without permission', async () => {
        await request.delete(url + '/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Delete role successfully', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(RoleBusiness.prototype, 'delete').resolves(true);

        const { data } = await request.delete(url + '/1');
        expect(data).to.eq(true);
    });
});
