import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as requestPromise from 'request-promise';
import { SinonSandbox, createSandbox } from 'sinon';
import { mapModel, mapModels } from '../../libs/common';
import { ApiService } from '../../web.api/ApiService';
import { AuthenticationBusiness } from '../../web.core/businesses/AuthenticationBusiness';
import { ClaimItem } from '../../web.core/dtos/permission/responses/ClaimItem';
import { ClaimResponse } from '../../web.core/dtos/permission/responses/ClaimResponse';
import { IPermission } from '../../web.core/interfaces/models/IPermission';
import { Permission } from '../../web.core/models/Permission';
import { PermissionBusiness } from '../../web.core/businesses/PermissionBusiness';
import { PermissionCreateRequest } from '../../web.core/dtos/permission/requests/PermissionCreateRequest';
import { PermissionResponse } from '../../web.core/dtos/permission/responses/PermissionResponse';
import { Response } from 'request';
import { Role } from '../../web.core/models/Role';
import { Server } from 'http';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { expect } from 'chai';

const generateUserAuth = () => {
    const userAuth = new UserAuthenticated();
    userAuth.id = 1;
    userAuth.role = new Role({ id: 1 } as any);
    userAuth.accessToken = 'access-token';
    userAuth.claims = [];
    return userAuth;
};

const generatePermissionDTOs = () => {
    return [
        new Permission({ id: 1, roleId: 1, claim: 1 } as IPermission),
        new Permission({ id: 2, roleId: 2, claim: 2 } as IPermission),
        new Permission({ id: 3, roleId: 3, claim: 3 } as IPermission)
    ];
};

const generatePermissionCreate = () => {
    const permissionCreate = new PermissionCreateRequest();
    permissionCreate.roleId = 1;
    permissionCreate.claim = 1;

    return permissionCreate;
};

describe('Permission controller testing', () => {
    let sandbox: SinonSandbox;
    let server: Server;
    const port = 3000;
    const url = `http://localhost:${port}/api/v1/permissions`;
    const headers = {};
    headers['Content-Type'] = 'application/json';
    const request = requestPromise.defaults({ headers, json: true });
    let userAuth: UserAuthenticated;
    let list: Permission[];

    before(function(done) {
        this.timeout(6000);
        sandbox = createSandbox();
        server = ApiService.start(done);
    });

    beforeEach(() => {
        userAuth = generateUserAuth();
        list = generatePermissionDTOs();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        server.close(done);
    });

    it('Get claims without permission', async () => {
        await request.get(url + '/claims').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Get claims', async () => {
        const claim = new ClaimResponse('Permission');
        const claimItem = new ClaimItem();
        claimItem.code = 1;
        claimItem.name = 'test';
        claim.items.push(claimItem);

        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(PermissionBusiness.prototype, 'getClaims').resolves([claim]);

        const { data } = await request.get(url + '/claims');
        expect(Array.isArray(data) && data.length && data[0].items && data[0].items.length && data[0].items[0].code === 1).to.eq(true);
    });

    it('Get my permissions without permission', async () => {
        await request.get(url + '/mine').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Get my permissions', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(PermissionBusiness.prototype, 'getAllByRole').resolves(mapModels(PermissionResponse, list));

        const { data } = await request.get(url + '/mine');
        expect(Array.isArray(data) && data.length === list.length).to.eq(true);
    });

    it('Get permissions by role without permission', async () => {
        await request.get(url + '/roles/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Get permissions by role', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(PermissionBusiness.prototype, 'getAllByRole').resolves(mapModels(PermissionResponse, list));

        const { data } = await request.get(url + '/roles/1');
        expect(Array.isArray(data) && data.length === list.length).to.eq(true);
    });

    it('Get permission by id without permission', async () => {
        await request.get(url + '/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Get permission by id', async () => {
        const permission = list[0];
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(PermissionBusiness.prototype, 'getById').resolves(mapModel(PermissionResponse, permission));

        const { data } = await request.get(url + '/1');
        expect(data && data.id === permission.id).to.eq(true);
    });

    it('Create permission without permission', async () => {
        await request.post(url).catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Create permission successfully', async () => {
        const permission = list[0];
        const permissionCreate = generatePermissionCreate();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(PermissionBusiness.prototype, 'create').resolves(mapModel(PermissionResponse, permission));

        const { data } = await request.post(url, { body: permissionCreate });
        expect(data && data.id === permission.id).to.eq(true);
    });

    it('Delete permission without permission', async () => {
        await request.delete(url + '/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Delete permission successfully', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(PermissionBusiness.prototype, 'delete').resolves(true);

        const { data } = await request.delete(url + '/1');
        expect(data).to.eq(true);
    });
});
