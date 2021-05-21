import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { LoginByEmailQuery } from './LoginByEmailQuery';
import { LoginByEmailQueryHandler } from './LoginByEmailQueryHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { User } from '../../../../domain/entities/user/User';
import { AuthType } from '../../../../domain/enums/auth/AuthType';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IAuth } from '../../../../domain/types/auth/IAuth';
import { IUser } from '../../../../domain/types/user/IUser';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IAuthJwtService } from '../../../../gateways/services/IAuthJwtService';

Container.set('auth.repository', {
    async getByUsername() {}
});
Container.set('auth_jwt.service', {
    sign() {}
});

const authRepository = Container.get<IAuthRepository>('auth.repository');
const authJwtService = Container.get<IAuthJwtService>('auth_jwt.service');
const loginByEmailQueryHandler = Container.get(LoginByEmailQueryHandler);

const generateAuth = () => {
    const user = new User({ id: uuid.v4(), status: UserStatus.ACTIVE, roleId: uuid.v4() } as IUser);
    return new Auth({ id: uuid.v4(), createdAt: new Date(), userId: user.id, user: user.toData(), type: AuthType.PERSONAL_EMAIL, username: 'test@localhost.com' } as IAuth);
};

describe('Authentication - Login by email', () => {
    const sandbox = createSandbox();
    let auth: Auth;

    beforeEach(() => {
        auth = generateAuth();
        auth.password = 'Nodecore@2';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Login by email without email', async () => {
        const param = new LoginByEmailQuery();

        const result = await loginByEmailQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'email'));
    });

    it('Login by email without password', async () => {
        const param = new LoginByEmailQuery();
        param.email = 'test@localhost.com';

        const result = await loginByEmailQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'password'));
    });

    it('Login by email with wrong email or password', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(null);
        const param = new LoginByEmailQuery();
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await loginByEmailQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INCORRECT, 'email or password'));
    });

    it('Login by email with account is not activated', async () => {
        auth.user!.status = UserStatus.INACTIVE;
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        const param = new LoginByEmailQuery();
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await loginByEmailQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account'));
    });

    it('Login by email successfully', async () => {
        sandbox.stub(authRepository, 'getByUsername').resolves(auth);
        sandbox.stub(authJwtService, 'sign').returns('token');
        const param = new LoginByEmailQuery();
        param.email = 'test@localhost.com';
        param.password = 'Nodecore@2';

        const result = await loginByEmailQueryHandler.handle(param);
        expect(result.token === 'token' && result.userId === auth.userId && result.roleId === auth.user!.roleId).to.eq(true);
    });
});
