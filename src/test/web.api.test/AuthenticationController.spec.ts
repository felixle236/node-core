import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as requestPromise from 'request-promise';
import { SinonSandbox, createSandbox } from 'sinon';
import { ApiService } from '../../web.api/ApiService';
import { AuthenticationBusiness } from '../../web.core/businesses/AuthenticationBusiness';
import { Gender } from '../../constants/Enums';
import { IUser } from '../../web.core/interfaces/models/IUser';
import { Server } from 'http';
import { User } from '../../web.core/models/User';
import { UserResponse } from '../../web.core/dtos/user/responses/UserResponse';
import { UserSigninRequest } from '../../web.core/dtos/user/requests/UserSigninRequest';
import { UserSigninSucceedResponse } from '../../web.core/dtos/user/responses/UserSigninSucceedResponse';
import { UserSignupRequest } from '../../web.core/dtos/user/requests/UserSignupRequest';
import { expect } from 'chai';
import { mapModel } from '../../libs/common';

const generateUser = () => {
    return new User({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: 1,
        firstName: 'Test',
        lastName: '1',
        email: 'test.1@localhost.com',
        gender: Gender.Male,
        birthday: new Date(),
        avatar: '../../resources/images/test-1-icon.png'
    } as IUser);
};

describe('Authentication controller testing', () => {
    let sandbox: SinonSandbox;
    let server: Server;
    const port = 3000;
    const url = `http://localhost:${port}/api/auth`;
    const request = requestPromise.defaults({ headers: { 'Content-Type': 'application/json' }, json: true });
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

    it('Signin', async () => {
        const userSignin = new UserSigninRequest();
        userSignin.email = 'test@localhost.com';
        userSignin.password = 'Nodecore@2';
        sandbox.stub(AuthenticationBusiness.prototype, 'signin').resolves(new UserSigninSucceedResponse(user, 'access-token'));

        const { data } = await request.post(url + '/signin', { body: userSignin });
        expect(data.accessToken === 'access-token' && data.profile && data.profile.id === user.id).to.eq(true);
    });

    it('Signup', async () => {
        const userSignup = new UserSignupRequest();
        userSignup.firstName = 'Test';
        userSignup.lastName = 'Local';
        userSignup.email = 'test@localhost.com';
        userSignup.password = 'Nodecore@2';
        sandbox.stub(AuthenticationBusiness.prototype, 'signup').resolves(mapModel(UserResponse, user));

        const { data } = await request.post(url + '/signup', { body: userSignup });
        expect(data.id).to.eq(user.id);
    });

    it('Active user', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'active').resolves(true);

        const { data } = await request.post(url + '/active', { body: { confirmKey: 'confirm key' } });
        expect(data).to.eq(true);
    });

    it('Re-send user activation', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'resendActivation').resolves(true);

        const { data } = await request.post(url + '/resend-activation', { body: { email: 'test@localhost.com' } });
        expect(data).to.eq(true);
    });

    it('Forgot password', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'forgotPassword').resolves(true);

        const { data } = await request.post(url + '/forgot-password', { body: { email: 'test@localhost.com' } });
        expect(data).to.eq(true);
    });

    it('Reset password', async () => {
        sandbox.stub(AuthenticationBusiness.prototype, 'resetPassword').resolves(true);

        const { data } = await request.put(url + '/reset-password', { body: { confirmKey: 'confirm key', password: 'Nodecore@2' } });
        expect(data).to.eq(true);
    });
});
