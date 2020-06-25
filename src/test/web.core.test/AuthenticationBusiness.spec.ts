import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as jwt from 'jsonwebtoken';
import { AUTH_SECRET_OR_PRIVATE_KEY, AUTH_SIGNATURE, DOMAIN, PROJECT_NAME, PROTOTYPE } from '../../constants/Environments';
import { SystemError, UnauthorizedError } from '../../web.core/dtos/common/Exception';
import { Container } from 'typedi';
import { GenderType } from '../../constants/Enums';
import { IAuthenticationBusiness } from '../../web.core/interfaces/businesses/IAuthenticationBusiness';
import { IRole } from '../../web.core/interfaces/models/IRole';
import { IUser } from '../../web.core/interfaces/models/IUser';
import { MailService } from '../../web.infrastructure/messages/mail/MailService';
import { Permission } from '../../web.core/models/Permission';
import { PermissionRepository } from '../../web.infrastructure/data/typeorm/repositories/PermissionRepository';
import { Role } from '../../web.core/models/Role';
import { RoleRepository } from '../../web.infrastructure/data/typeorm/repositories/RoleRepository';
import { User } from '../../web.core/models/User';
import { UserRepository } from '../../web.infrastructure/data/typeorm/repositories/UserRepository';
import { UserSigninRequest } from '../../web.core/dtos/user/requests/UserSigninRequest';
import { UserSignupRequest } from '../../web.core/dtos/user/requests/UserSignupRequest';
import { addSeconds } from '../../libs/date';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

const generateRole = () => {
    return new Role({ id: 2, createdAt: new Date(), updatedAt: new Date(), name: 'Role 2', level: 2 } as IRole);
};

const generateUsers = () => {
    return [
        new User({ id: 1, createdAt: new Date(), updatedAt: new Date(), activedAt: new Date(), roleId: 1, firstName: 'Test', lastName: '1', email: 'test.1@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '../../resources/images/test-1-icon.png' } as IUser),
        new User({ id: 2, createdAt: new Date(), updatedAt: new Date(), activedAt: new Date(), roleId: 2, firstName: 'Test', lastName: '2', email: 'test.2@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '../../resources/images/test-2-icon.png' } as IUser),
        new User({ id: 3, createdAt: new Date(), updatedAt: new Date(), activedAt: new Date(), roleId: 2, firstName: 'Test', lastName: '3', email: 'test.3@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '../../resources/images/test-3-icon.png' } as IUser)
    ];
};

const generateUserSignup = () => {
    const userSignup = new UserSignupRequest();
    userSignup.firstName = 'Test';
    userSignup.lastName = 'Local';
    userSignup.email = 'test@localhost.com';
    userSignup.password = 'Nodecore@2';

    return userSignup;
};

const generateUserPayload = () => {
    return {
        sub: '2',
        roleId: 2
    };
};

describe('User auth business testing', () => {
    const sandbox = createSandbox();
    const userAuthBusiness = Container.get<IAuthenticationBusiness>('authentication.business');
    let list: User[];

    beforeEach(() => {
        list = generateUsers();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Authenticate user without token', async () => {
        await userAuthBusiness.authenticateUser('').catch((error: UnauthorizedError) => {
            expect(error.name).to.eq(new UnauthorizedError(1010, 'authorization token').name);
        });
    });

    it('Authenticate user with an invalid token', async () => {
        await userAuthBusiness.authenticateUser('123').catch((error: UnauthorizedError) => {
            expect(error.name).to.eq(new UnauthorizedError(1010, 'authorization token').name);
        });
    });

    it('Authenticate user with error', async () => {
        sandbox.stub(jwt, 'verify').resolves(undefined);
        const token = jwt.sign({ roleId: 2 }, AUTH_SECRET_OR_PRIVATE_KEY, {
            issuer: PROJECT_NAME,
            subject: '2',
            audience: `${PROTOTYPE}://${DOMAIN}`,
            expiresIn: 24 * 60 * 60,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);

        await userAuthBusiness.authenticateUser(token).catch((error: UnauthorizedError) => {
            expect(error.name).to.eq(new UnauthorizedError(1002, 'token').name);
        });
    });

    it('Authenticate user with token has expired', async () => {
        const token = jwt.sign({ roleId: 2 }, AUTH_SECRET_OR_PRIVATE_KEY, {
            issuer: PROJECT_NAME,
            subject: '2',
            audience: `${PROTOTYPE}://${DOMAIN}`,
            expiresIn: -1,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);

        await userAuthBusiness.authenticateUser(token).catch((error: UnauthorizedError) => {
            expect(error.name).to.eq(new UnauthorizedError(1008, 'token').name);
        });
    });

    it('Authenticate user with an invalid role', async () => {
        const payload = generateUserPayload();
        sandbox.stub(jwt, 'verify').returns(payload as any);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([]);

        const token = jwt.sign({ roleId: 2 }, AUTH_SECRET_OR_PRIVATE_KEY, {
            issuer: PROJECT_NAME,
            subject: '2',
            audience: `${PROTOTYPE}://${DOMAIN}`,
            expiresIn: 24 * 60 * 60,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);

        await userAuthBusiness.authenticateUser(token).catch((error: UnauthorizedError) => {
            expect(error.message).to.eq(new UnauthorizedError(3).message);
        });
    });

    it('Authenticate user success without claims', async () => {
        const payload = generateUserPayload();
        const role = generateRole();
        sandbox.stub(jwt, 'verify').returns(payload as any);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves([]);

        const token = jwt.sign({ roleId: 2 }, AUTH_SECRET_OR_PRIVATE_KEY, {
            issuer: PROJECT_NAME,
            subject: '2',
            audience: `${PROTOTYPE}://${DOMAIN}`,
            expiresIn: 24 * 60 * 60,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);

        const result = await userAuthBusiness.authenticateUser(token, []);
        expect(result && result.id === 2 && result.accessToken === token && result.role.id === role.id).to.eq(true);
    });

    it('Authenticate user with access denied', async () => {
        const payload = generateUserPayload();
        const role = generateRole();

        const permissions = [{
            claim: 1
        }] as Permission[];

        const token = jwt.sign({ roleId: 2 }, AUTH_SECRET_OR_PRIVATE_KEY, {
            issuer: PROJECT_NAME,
            subject: '2',
            audience: `${PROTOTYPE}://${DOMAIN}`,
            expiresIn: 24 * 60 * 60,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);

        sandbox.stub(jwt, 'verify').returns(payload as any);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves(permissions);

        await userAuthBusiness.authenticateUser(token, [2]).catch((error: UnauthorizedError) => {
            expect(error.message).to.eq(new UnauthorizedError(3).message);
        });
    });

    it('Authenticate user success with claims', async () => {
        const payload = generateUserPayload();
        const role = generateRole();

        const permissions = [{
            claim: 1
        }] as Permission[];

        const token = jwt.sign({ roleId: 2 }, AUTH_SECRET_OR_PRIVATE_KEY, {
            issuer: PROJECT_NAME,
            subject: '2',
            audience: `${PROTOTYPE}://${DOMAIN}`,
            expiresIn: 24 * 60 * 60,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);

        sandbox.stub(jwt, 'verify').returns(payload as any);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);
        sandbox.stub(PermissionRepository.prototype, 'getAllByRole').resolves(permissions);

        const result = await userAuthBusiness.authenticateUser(token, [1]);
        expect(result && result.id === 2 && result.accessToken === token && result.role.id === role.id).to.eq(true);
    });

    it('Signin without email', async () => {
        const userSignin = new UserSigninRequest();
        userSignin.email = '';
        userSignin.password = 'Nodecore@2';

        await userAuthBusiness.signin(userSignin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'email').message);
        });
    });

    it('Signin with an invalid email', async () => {
        const userSignin = new UserSigninRequest();
        userSignin.email = 'test@';
        userSignin.password = 'Nodecore@2';

        await userAuthBusiness.signin(userSignin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'email').message);
        });
    });

    it('Signin with email length greater than 120 characters', async () => {
        const userSignin = new UserSigninRequest();
        userSignin.email = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';
        userSignin.password = 'Nodecore@2';

        await userAuthBusiness.signin(userSignin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'email', 120).message);
        });
    });

    it('Signin without password', async () => {
        const userSignin = new UserSigninRequest();
        userSignin.email = 'test@localhost.com';
        userSignin.password = '';

        await userAuthBusiness.signin(userSignin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'password').message);
        });
    });

    it('Signin with password is not secure', async () => {
        const userSignin = new UserSigninRequest();
        userSignin.email = 'test@localhost.com';
        userSignin.password = '123abc';

        await userAuthBusiness.signin(userSignin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3002, 'password', 6, 20).message);
        });
    });

    it('Signin with wrong email or password', async () => {
        const userSignin = new UserSigninRequest();
        userSignin.email = 'test@localhost.com';
        userSignin.password = 'Nodecore@123';
        sandbox.stub(UserRepository.prototype, 'getByUserPassword').resolves(undefined);

        await userAuthBusiness.signin(userSignin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1003, 'email address or password').message);
        });
    });

    it('Signin with wrong email or password', async () => {
        const user = new User({
            id: 1,
            roleId: 1,
            firstName: 'Test',
            lastName: '1',
            email: 'test.1@localhost.com'
        } as User);
        sandbox.stub(UserRepository.prototype, 'getByUserPassword').resolves(user);

        const userSignin = new UserSigninRequest();
        userSignin.email = 'test@localhost.com';
        userSignin.password = 'Nodecore@123';

        await userAuthBusiness.signin(userSignin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1009, 'account').message);
        });
    });

    it('Signin successfully', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getByUserPassword').resolves(item);

        const userSignin = new UserSigninRequest();
        userSignin.email = 'test@localhost.com';
        userSignin.password = 'Nodecore@2';

        const result = await userAuthBusiness.signin(userSignin);
        expect(!!result).to.eq(true);
    });

    it('Signin with return permissions successfully', async () => {
        const item = new User({ id: 1, createdAt: new Date(), updatedAt: new Date(), activedAt: new Date(), roleId: 1, role: { id: 1, name: 'Role 1', level: 1, permissions: [{ id: 1, roleId: 1, claim: 1 }] }, firstName: 'Test', lastName: '1', email: 'test.1@localhost.com', gender: GenderType.MALE, birthday: new Date(), avatar: '../../resources/images/test-1-icon.png' } as User);
        sandbox.stub(UserRepository.prototype, 'getByUserPassword').resolves(item);

        const userSignin = new UserSigninRequest();
        userSignin.email = 'test@localhost.com';
        userSignin.password = 'Nodecore@2';

        const result = await userAuthBusiness.signin(userSignin);
        expect(!!result).to.eq(true);
    });

    it('Signup without first name', async () => {
        const userSignup = generateUserSignup();
        userSignup.firstName = '';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'first name').message);
        });
    });

    it('Signup with an invalid first name', async () => {
        const userSignup = generateUserSignup();
        userSignup.firstName = 123 as any;

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'first name').message);
        });
    });

    it('Signup with first name length greater than 20 characters', async () => {
        const userSignup = generateUserSignup();
        userSignup.firstName = 'This is the first name with length greater than 20 characters!';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'first name', 20).message);
        });
    });

    it('Signup with an invalid last name', async () => {
        const userSignup = generateUserSignup();
        userSignup.lastName = 123 as any;

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'last name').message);
        });
    });

    it('Signup with last name length greater than 20 characters', async () => {
        const userSignup = generateUserSignup();
        userSignup.lastName = 'This is the last name with length greater than 20 characters!';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'last name', 20).message);
        });
    });

    it('Signup without email', async () => {
        const userSignup = generateUserSignup();
        userSignup.email = '';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'email').message);
        });
    });

    it('Signup with an invalid email', async () => {
        const userSignup = generateUserSignup();
        userSignup.email = 'test@';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'email').message);
        });
    });

    it('Signup with email length greater than 120 characters', async () => {
        const userSignup = generateUserSignup();
        userSignup.email = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'email', 120).message);
        });
    });

    it('Signup without password', async () => {
        const userSignup = generateUserSignup();
        userSignup.password = '';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1001, 'password').message);
        });
    });

    it('Signup with password length greater than 20 characters', async () => {
        const userSignup = generateUserSignup();
        userSignup.password = 'This is the password with length greater than 20 characters!';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(2004, 'password', 20).message);
        });
    });

    it('Signup with password is not secure', async () => {
        const userSignup = generateUserSignup();
        userSignup.password = '123456';

        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(3002, 'password', 6, 20).message);
        });
    });

    it('Signup with email has exists', async () => {
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(true);

        const userSignup = generateUserSignup();
        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1005, 'email').message);
        });
    });

    it('Signup with role not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(undefined);

        const userSignup = generateUserSignup();
        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'role').message);
        });
    });

    it('Signup with cannot save error', async () => {
        const role = generateRole();
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        sandbox.stub(UserRepository.prototype, 'create').resolves();

        const userSignup = generateUserSignup();
        await userAuthBusiness.signup(userSignup).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(5).message);
        });
    });

    it('Signup successfully', async () => {
        const user = list[0];
        const role = generateRole();
        sandbox.stub(UserRepository.prototype, 'checkEmailExist').resolves(false);
        sandbox.stub(RoleRepository.prototype, 'getById').resolves(role);
        sandbox.stub(UserRepository.prototype, 'create').resolves(user.id);
        sandbox.stub(UserRepository.prototype, 'getById').resolves(user);
        sandbox.stub(MailService.prototype, 'sendUserActivation').resolves();

        const userSignup = generateUserSignup();
        const result = await userAuthBusiness.signup(userSignup);
        expect(result && result.id === user.id).to.eq(true);
    });

    it('Active account without active key', async () => {
        await userAuthBusiness.active('').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Active account with active key is not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'getByActiveKey').resolves(undefined);

        await userAuthBusiness.active('node-core').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'activation key').message);
        });
    });

    it('Active account with account has actived already', async () => {
        const item = list[0];
        item.activedAt = new Date();
        sandbox.stub(UserRepository.prototype, 'getByActiveKey').resolves(item);

        await userAuthBusiness.active('node-core').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Active account with active key has expired', async () => {
        const item = list[0];
        item.activeKey = 'key';
        item.activeExpire = addSeconds(new Date(), -100);
        item.activedAt = undefined;
        sandbox.stub(UserRepository.prototype, 'getByActiveKey').resolves(item);

        await userAuthBusiness.active('node-core').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1008, 'activation key').message);
        });
    });

    it('Active account successfully', async () => {
        const item = list[0];
        item.activeKey = 'key';
        item.activeExpire = addSeconds(new Date(), 100);
        item.activedAt = undefined;
        sandbox.stub(UserRepository.prototype, 'getByActiveKey').resolves(item);
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);

        const hasSucceed = await userAuthBusiness.active('node-core');
        expect(hasSucceed).to.eq(true);
    });

    it('Re-send activation with an invalid email', async () => {
        await userAuthBusiness.resendActivation('test@localhost').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'email').message);
        });
    });

    it('Re-send activation with email is not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(undefined);

        await userAuthBusiness.resendActivation('test@localhost.com').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Re-send activation with account has actived already', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(item);

        await userAuthBusiness.resendActivation('test@localhost.com').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Re-send activation successfully', async () => {
        const item = list[0];
        item.activedAt = undefined;
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(item);
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);
        sandbox.stub(MailService.prototype, 'resendUserActivation').resolves();

        const hasSucceed = await userAuthBusiness.resendActivation('test@localhost.com');
        expect(hasSucceed).to.eq(true);
    });

    it('Forgot password with an invalid email', async () => {
        await userAuthBusiness.forgotPassword('test@localhost').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1002, 'email').message);
        });
    });

    it('Forgot password with email is not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(undefined);

        await userAuthBusiness.forgotPassword('test@localhost.com').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Forgot password with account is not actived', async () => {
        const item = list[0];
        item.activedAt = undefined;
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(item);

        await userAuthBusiness.forgotPassword('test@localhost.com').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Forgot password successfully', async () => {
        const item = list[0];
        sandbox.stub(UserRepository.prototype, 'getByEmail').resolves(item);
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);
        sandbox.stub(MailService.prototype, 'sendForgotPassword').resolves();

        const hasSucceed = await userAuthBusiness.forgotPassword('test@localhost.com');
        expect(hasSucceed).to.eq(true);
    });

    it('Reset password without forgot key', async () => {
        await userAuthBusiness.resetPassword('', '').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Reset password without new password', async () => {
        await userAuthBusiness.resetPassword('node-core', '').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Reset password with forgot key is not exists', async () => {
        sandbox.stub(UserRepository.prototype, 'getByForgotKey').resolves(undefined);

        await userAuthBusiness.resetPassword('node-core', 'Nodecore@2').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1004, 'forgot key').message);
        });
    });

    it('Reset password with account is not actived', async () => {
        const item = list[0];
        item.activedAt = undefined;
        sandbox.stub(UserRepository.prototype, 'getByForgotKey').resolves(item);

        await userAuthBusiness.resetPassword('node-core', 'Nodecore@2').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError().message);
        });
    });

    it('Reset password with forgot key has expired', async () => {
        const item = list[0];
        item.forgotKey = 'key';
        item.forgotExpire = addSeconds(new Date(), -100);
        sandbox.stub(UserRepository.prototype, 'getByForgotKey').resolves(item);

        await userAuthBusiness.resetPassword('node-core', 'Nodecore@2').catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(1008, 'forgot key').message);
        });
    });

    it('Reset password successfully', async () => {
        const item = list[0];
        item.forgotKey = 'key';
        item.forgotExpire = addSeconds(new Date(), 100);
        sandbox.stub(UserRepository.prototype, 'getByForgotKey').resolves(item);
        sandbox.stub(UserRepository.prototype, 'update').resolves(true);

        const hasSucceed = await userAuthBusiness.resetPassword('node-core', 'Nodecore@2');
        expect(hasSucceed).to.eq(true);
    });
});
