import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as path from 'path';
import * as requestPromise from 'request-promise';
import { SinonSandbox, createSandbox } from 'sinon';
import { ApiService } from '../../web.api/ApiService';
import { AuthenticationBusiness } from '../../web.core/businesses/AuthenticationBusiness';
import { GenderType } from '../../constants/Enums';
import { IUser } from '../../web.core/interfaces/models/IUser';
import { Response } from 'request';
import { RoleResponse } from '../../web.core/dtos/role/responses/RoleResponse';
import { Server } from 'http';
import { User } from '../../web.core/models/User';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { UserBusiness } from '../../web.core/businesses/UserBusiness';
import { UserPasswordUpdateRequest } from '../../web.core/dtos/user/requests/UserPasswordUpdateRequest';
import { UserResponse } from '../../web.core/dtos/user/responses/UserResponse';
import { UserUpdateRequest } from '../../web.core/dtos/user/requests/UserUpdateRequest';
import { expect } from 'chai';
import { mapModel } from '../../libs/common';
import { readFile } from '../../libs/file';

const generateUserAuth = () => {
    const userAuth = new UserAuthenticated();
    userAuth.id = 1;
    userAuth.role = new RoleResponse({ id: 1 } as any);
    userAuth.accessToken = 'access-token';
    userAuth.claims = [];
    return userAuth;
};

const generateUsers = () => {
    return [
        new User({ id: 1, createdAt: new Date(), updatedAt: new Date(), roleId: 1, firstName: 'Test', lastName: '1', email: 'test.1@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '../../resources/images/test-1-icon.png' } as IUser),
        new User({ id: 2, createdAt: new Date(), updatedAt: new Date(), roleId: 2, firstName: 'Test', lastName: '2', email: 'test.2@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '../../resources/images/test-2-icon.png' } as IUser),
        new User({ id: 3, createdAt: new Date(), updatedAt: new Date(), roleId: 3, firstName: 'Test', lastName: '3', email: 'test.3@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '../../resources/images/test-3-icon.png' } as IUser)
    ];
};

const generateUserUpdate = () => {
    const userUpdate = new UserUpdateRequest();
    userUpdate.firstName = 'Test';
    userUpdate.lastName = 'Local';
    userUpdate.gender = GenderType.MALE;
    userUpdate.birthday = new Date();
    userUpdate.phone = '0123456789';
    userUpdate.address = '123 Abc';
    userUpdate.culture = 'en-US';
    userUpdate.currency = 'USD';

    return userUpdate;
};

describe('Me controller testing', () => {
    let sandbox: SinonSandbox;
    let server: Server;
    const port = 3000;
    const url = `http://localhost:${port}/api/v1/me`;
    const headers = {};
    headers['Content-Type'] = 'application/json';
    const request = requestPromise.defaults({ headers, json: true });
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

    it('Get user profile without permission', async () => {
        await request.get(url).catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Get user profile', async () => {
        const user = list[0];
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'getById').resolves(mapModel(UserResponse, user));

        const { data } = await request.get(url);
        expect(data && data.id === user.id).to.eq(true);
    });

    it('Update profile without permission', async () => {
        await request.put(url).catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Update profile successfully', async () => {
        const user = list[0];
        const userUpdate = generateUserUpdate();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'update').resolves(mapModel(UserResponse, user));

        const { data } = await request.put(url, { body: userUpdate });
        expect(data && data.id === user.id).to.eq(true);
    });

    it('Update password without permission', async () => {
        await request.patch(url + '/password').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Update password successfully', async () => {
        const userPasswordUpdate = new UserPasswordUpdateRequest();
        userPasswordUpdate.password = '123456';
        userPasswordUpdate.newPassword = 'Nodecore@2';

        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'updatePassword').resolves(true);

        const { data } = await request.patch(url + '/password', { body: userPasswordUpdate });
        expect(data).to.eq(true);
    });

    it('Update avatar without permission', async () => {
        await request.post(url + '/avatar').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Update avatar successfully', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'uploadAvatar').resolves('/path/avatar.png');
        const filePath = path.join(__dirname, '../resources/images/workplace.tiff');
        const buffer = await readFile(filePath);

        const { data } = await request.post(url + '/avatar', {
            formData: {
                avatar: {
                    value: buffer,
                    options: {
                        filename: 'avatar.png',
                        contentType: 'image/png'
                    }
                }
            }
        });
        expect(data).to.eq('/path/avatar.png');
    });
});
