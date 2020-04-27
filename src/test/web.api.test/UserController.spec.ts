import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as requestPromise from 'request-promise';
import { SinonSandbox, createSandbox } from 'sinon';
import { mapModel, mapModels } from '../../libs/common';
import { ApiService } from '../../web.api/ApiService';
import { AuthenticationBusiness } from '../../web.core/businesses/AuthenticationBusiness';
import { Gender } from '../../constants/Enums';
import { IRole } from '../../web.core/interfaces/models/IRole';
import { IUser } from '../../web.core/interfaces/models/IUser';
import { Response } from 'request';
import { ResultListResponse } from '../../web.core/dtos/common/ResultListResponse';
import { Role } from '../../web.core/models/Role';
import { Server } from 'http';
import { User } from '../../web.core/models/User';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { UserBusiness } from '../../web.core/businesses/UserBusiness';
import { UserCreateRequest } from '../../web.core/dtos/user/requests/UserCreateRequest';
import { UserResponse } from '../../web.core/dtos/user/responses/UserResponse';
import { UserUpdateRequest } from '../../web.core/dtos/user/requests/UserUpdateRequest';
import { expect } from 'chai';

const generateUserAuth = () => {
    const userAuth = new UserAuthenticated();
    userAuth.id = 1;
    userAuth.role = new Role({ id: 1 } as any);
    userAuth.accessToken = 'access-token';
    userAuth.claims = [];
    return userAuth;
};

const generateRole = () => {
    return new Role({ id: 1, createdAt: new Date(), updatedAt: new Date(), name: 'Role 1', level: 1 } as IRole);
};

const generateUsers = () => {
    return [
        new User({ id: 1, createdAt: new Date(), updatedAt: new Date(), roleId: 1, firstName: 'Test', lastName: '1', email: 'test.1@localhost.com', gender: Gender.Male, birthday: new Date(), avatar: '../../resources/images/test-1-icon.png' } as IUser),
        new User({ id: 2, createdAt: new Date(), updatedAt: new Date(), roleId: 2, firstName: 'Test', lastName: '2', email: 'test.2@localhost.com', gender: Gender.Male, birthday: new Date(), avatar: '../../resources/images/test-2-icon.png' } as IUser),
        new User({ id: 3, createdAt: new Date(), updatedAt: new Date(), roleId: 3, firstName: 'Test', lastName: '3', email: 'test.3@localhost.com', gender: Gender.Male, birthday: new Date(), avatar: '../../resources/images/test-3-icon.png' } as IUser)
    ];
};

const generateUserCreate = () => {
    const userCreate = new UserCreateRequest();
    userCreate.roleId = generateRole().id;
    userCreate.firstName = 'Test';
    userCreate.lastName = 'Local';
    userCreate.email = 'test@localhost.com';
    userCreate.password = 'Nodecore@2';
    userCreate.gender = Gender.Male;
    userCreate.birthday = new Date();
    userCreate.phone = '0123456789';
    userCreate.address = '123 Abc';
    userCreate.culture = 'en-US';
    userCreate.currency = 'USD';

    return userCreate;
};

const generateUserUpdate = () => {
    const userUpdate = new UserUpdateRequest();
    userUpdate.firstName = 'Test';
    userUpdate.lastName = 'Local';
    userUpdate.gender = Gender.Male;
    userUpdate.birthday = new Date();
    userUpdate.phone = '0123456789';
    userUpdate.address = '123 Abc';
    userUpdate.culture = 'en-US';
    userUpdate.currency = 'USD';

    return userUpdate;
};

describe('User controller testing', () => {
    let sandbox: SinonSandbox;
    let server: Server;
    const port = 3000;
    const url = `http://localhost:${port}/api/users`;
    const request = requestPromise.defaults({ headers: { 'Content-Type': 'application/json' }, json: true });
    let userAuth: UserAuthenticated;
    let list: User[];

    before(function(done) {
        this.timeout(6000);
        sandbox = createSandbox();
        server = ApiService.start(done);
    });

    beforeEach(() => {
        userAuth = generateUserAuth();
        list = generateUsers();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        server.close(done);
    });

    it('Find users without permission', async () => {
        await request.get(url).catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Find users', async () => {
        const resultList = new ResultListResponse(mapModels(UserResponse, list), list.length, 0, 10);
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'find').resolves(resultList);

        const { data } = await request.get(url);
        expect(data.pagination && data.results && Array.isArray(data.results) && data.results.length === resultList.results.length).to.eq(true);
    });

    it('Find common users without permission', async () => {
        await request.get(url + '/common').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Find common users', async () => {
        const resultList = new ResultListResponse(mapModels(UserResponse, list), list.length, 0, 10);
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'findCommon').resolves(resultList);

        const { data } = await request.get(url + '/common');
        expect(data.pagination && data.results && Array.isArray(data.results) && data.results.length === resultList.results.length).to.eq(true);
    });

    it('Get user by id without permission', async () => {
        await request.get(url + '/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Get user by id', async () => {
        const user = list[0];
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'getById').resolves(mapModel(UserResponse, user));

        const { data } = await request.get(url + '/1');
        expect(data && data.id === user.id).to.eq(true);
    });

    it('Create user without permission', async () => {
        await request.post(url).catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Create user successfully', async () => {
        const user = list[0];
        const userCreate = generateUserCreate();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'create').resolves(mapModel(UserResponse, user));

        const { data } = await request.post(url, { body: userCreate });
        expect(data && data.id === user.id).to.eq(true);
    });

    it('Update user without permission', async () => {
        await request.put(url + '/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Update user successfully', async () => {
        const user = list[0];
        const userUpdate = generateUserUpdate();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'update').resolves(mapModel(UserResponse, user));

        const { data } = await request.put(url + '/1', { body: userUpdate });
        expect(data && data.id === user.id).to.eq(true);
    });

    it('Delete user without permission', async () => {
        await request.delete(url + '/1').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Delete user successfully', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'delete').resolves(true);

        const { data } = await request.delete(url + '/1');
        expect(data).to.eq(true);
    });
});
