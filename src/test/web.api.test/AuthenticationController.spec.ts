import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as requestPromise from 'request-promise';
import { SinonSandbox, createSandbox } from 'sinon';
import { ApiService } from '../../web.api/ApiService';
import { AuthenticationBusiness } from '../../web.core/businesses/AuthenticationBusiness';
import { GenderType } from '../../constants/Enums';
import { IUser } from '../../web.core/gateways/models/IUser';
import { Server } from 'http';
import { User } from '../../web.core/models/User';
import { UserLoginRequest } from '../../web.core/dtos/user/requests/UserLoginRequest';
import { UserLoginSucceedResponse } from '../../web.core/dtos/user/responses/UserLoginSucceedResponse';
import { expect } from 'chai';

const generateUser = () => {
    return new User({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: 1,
        firstName: 'Test',
        lastName: '1',
        email: 'test.1@localhost.com',
        gender: GenderType.MALE,
        birthday: new Date(),
        avatar: '../../resources/images/test-1-icon.png'
    } as IUser);
};

describe('Authentication controller testing', () => {
    let sandbox: SinonSandbox;
    let server: Server;
    const port = 3000;
    const url = `http://localhost:${port}/api/v1/auth`;
    const headers = {};
    headers['Content-Type'] = 'application/json';
    const request = requestPromise.defaults({ headers, json: true });
    let user: User;

    before(function(done) {
        this.timeout(10000);
        sandbox = createSandbox();
        server = ApiService.start(done);
    });

    beforeEach(() => {
        user = generateUser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        server.close(done);
    });

    it('Login', async () => {
        const userLogin = new UserLoginRequest();
        userLogin.email = 'test@localhost.com';
        userLogin.password = 'Nodecore@2';
        sandbox.stub(AuthenticationBusiness.prototype, 'login').resolves(new UserLoginSucceedResponse(user, 'access-token'));

        const { data } = await request.post(url + '/login', { body: userLogin });
        expect(data.accessToken === 'access-token' && data.profile && data.profile.id === user.id).to.eq(true);
    });
});
