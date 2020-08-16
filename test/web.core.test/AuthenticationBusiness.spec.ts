import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as jwt from 'jsonwebtoken';
import { AUTH_SECRET_OR_PRIVATE_KEY, AUTH_SIGNATURE, DOMAIN, PROJECT_NAME, PROTOTYPE } from '../../configs/Configuration';
import { SystemError, UnauthorizedError } from '../../web.core/dtos/common/Exception';
import { Container } from 'typedi';
import { IAuthenticationBusiness } from '../../web.core/gateways/businesses/IAuthenticationBusiness';
import { IRole } from '../../web.core/gateways/models/IRole';
import { IUser } from '../../web.core/gateways/models/IUser';
import { Role } from '../../web.core/models/Role';
import { RoleRepository } from '../../web.infrastructure/data/typeorm/repositories/RoleRepository';
import { User } from '../../web.core/models/User';
import { UserLoginRequest } from '../../web.core/dtos/user/requests/UserLoginRequest';
import { UserRepository } from '../../web.infrastructure/data/typeorm/repositories/UserRepository';
import { UserStatus } from '../../configs/ServiceProvider';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

const generateRole = () => {
    return new Role({ id: 2, createdAt: new Date(), updatedAt: new Date(), name: 'Role 2', level: 2 } as IRole);
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

    afterEach(() => {
        sandbox.restore();
    });

    it('Authenticate user without token', async () => {
        await userAuthBusiness.authenticateUser('').catch((error: UnauthorizedError) => {
            expect(error.name).to.eq(new UnauthorizedError(MessageError.PARAM_INVALID, 'authorization token').name);
        });
    });

    it('Authenticate user with an invalid token', async () => {
        await userAuthBusiness.authenticateUser('123').catch((error: UnauthorizedError) => {
            expect(error.name).to.eq(new UnauthorizedError(MessageError.PARAM_INVALID, 'authorization token').name);
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
            expect(error.name).to.eq(new UnauthorizedError(MessageError.PARAM_INVALID, 'authorization token').name);
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
            expect(error.name).to.eq(new UnauthorizedError(MessageError.PARAM_EXPIRED, 'authorization token').name);
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
            expect(error.message).to.eq(new UnauthorizedError(MessageError.ACCESS_DENIED).message);
        });
    });

    it('Authenticate user with access denied', async () => {
        const payload = generateUserPayload();
        const role = { id: 3 } as Role;
        sandbox.stub(jwt, 'verify').returns(payload as any);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);

        const token = jwt.sign({ roleId: 2 }, AUTH_SECRET_OR_PRIVATE_KEY, {
            issuer: PROJECT_NAME,
            subject: '2',
            audience: `${PROTOTYPE}://${DOMAIN}`,
            expiresIn: 24 * 60 * 60,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);

        await userAuthBusiness.authenticateUser(token).catch((error: UnauthorizedError) => {
            expect(error.message).to.eq(new UnauthorizedError(MessageError.ACCESS_DENIED).message);
        });
    });

    it('Authenticate user success', async () => {
        const payload = generateUserPayload();
        const role = generateRole();

        const token = jwt.sign({ roleId: 2 }, AUTH_SECRET_OR_PRIVATE_KEY, {
            issuer: PROJECT_NAME,
            subject: '2',
            audience: `${PROTOTYPE}://${DOMAIN}`,
            expiresIn: 24 * 60 * 60,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);

        sandbox.stub(jwt, 'verify').returns(payload as any);
        sandbox.stub(RoleRepository.prototype, 'getAll').resolves([role]);

        const result = await userAuthBusiness.authenticateUser(token, [role.id]);
        expect(result && result.userId === 2 && result.accessToken === token && result.role.id === role.id).to.eq(true);
    });

    it('Login without email', async () => {
        const userLogin = new UserLoginRequest();
        userLogin.email = '';
        userLogin.password = 'Nodecore@2';

        await userAuthBusiness.login(userLogin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_REQUIRED, 'email').message);
        });
    });

    it('Login with an invalid email', async () => {
        const userLogin = new UserLoginRequest();
        userLogin.email = 'test@';
        userLogin.password = 'Nodecore@2';

        await userAuthBusiness.login(userLogin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INVALID, 'email').message);
        });
    });

    it('Login with email length greater than 120 characters', async () => {
        const userLogin = new UserLoginRequest();
        userLogin.email = 'test.localhost.test.localhost.test.localhost.localhost.localhost@test-asdfaasdfasfdgsgdsfasdfaasdfasfdgsgdsf-localhost.com';
        userLogin.password = 'Nodecore@2';

        await userAuthBusiness.login(userLogin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'email', 120).message);
        });
    });

    it('Login without password', async () => {
        const userLogin = new UserLoginRequest();
        userLogin.email = 'test@localhost.com';
        userLogin.password = '';

        await userAuthBusiness.login(userLogin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_REQUIRED, 'password').message);
        });
    });

    it('Login with password is not secure', async () => {
        const userLogin = new UserLoginRequest();
        userLogin.email = 'test@localhost.com';
        userLogin.password = '123abc';

        await userAuthBusiness.login(userLogin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, 'password', 6, 20).message);
        });
    });

    it('Login with wrong email or password', async () => {
        const userLogin = new UserLoginRequest();
        userLogin.email = 'test@localhost.com';
        userLogin.password = 'Nodecore@123';
        sandbox.stub(UserRepository.prototype, 'getByUserPassword').resolves(undefined);

        await userAuthBusiness.login(userLogin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_INCORRECT, 'email address or password').message);
        });
    });

    it('Login with wrong email or password', async () => {
        const user = new User({
            id: 1,
            roleId: 1,
            firstName: 'Test',
            lastName: '1',
            email: 'test.1@localhost.com'
        } as User);
        sandbox.stub(UserRepository.prototype, 'getByUserPassword').resolves(user);

        const userLogin = new UserLoginRequest();
        userLogin.email = 'test@localhost.com';
        userLogin.password = 'Nodecore@123';

        await userAuthBusiness.login(userLogin).catch((error: SystemError) => {
            expect(error.message).to.eq(new SystemError(MessageError.PARAM_NOT_VERIFIED, 'account').message);
        });
    });

    it('Login successfully', async () => {
        const item = new User({ id: 1, createdAt: new Date(), updatedAt: new Date(), roleId: 1, role: { id: 1, name: 'Role 1', level: 1 } as IRole, status: UserStatus.ACTIVED, firstName: 'Test', lastName: '1', email: 'test.1@localhost.com' } as IUser);
        sandbox.stub(UserRepository.prototype, 'getByUserPassword').resolves(item);

        const userLogin = new UserLoginRequest();
        userLogin.email = 'test@localhost.com';
        userLogin.password = 'Nodecore@2';

        const result = await userAuthBusiness.login(userLogin);
        expect(!!result).to.eq(true);
    });
});
