import 'reflect-metadata';
import 'mocha';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { AUTH_SECRET_OR_PRIVATE_KEY, AUTH_SIGNATURE, DOMAIN, PROJECT_NAME, PROTOTYPE } from '../../../../../configs/Configuration';
import { IJwtAuthService, IJwtPayloadExtend } from '../../../../gateways/services/IJwtAuthService';
import { Container } from 'typedi';
import { IRole } from '../../../../domain/types/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { JwtAuthUserQuery } from './JwtAuthUserQuery';
import { JwtAuthUserQueryHandler } from './JwtAuthUserQueryHandler';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { Role } from '../../../../domain/entities/Role';
import { UnauthorizedError } from '../../../../domain/common/exceptions/UnauthorizedError';
import { createSandbox } from 'sinon';
import { expect } from 'chai';

Container.set('role.repository', {
    async getAll() {}
});
Container.set('jwt.auth.service', {
    async verify() {}
});
const roleRepository = Container.get<IRoleRepository>('role.repository');
const jwtAuthService = Container.get<IJwtAuthService>('jwt.auth.service');
const jwtAuthUserQueryHandler = Container.get(JwtAuthUserQueryHandler);

const generateRoles = () => {
    return [
        new Role({ id: uuid.v4(), name: 'Role 1' } as IRole),
        new Role({ id: uuid.v4(), name: 'Role 2' } as IRole),
        new Role({ id: uuid.v4(), name: 'Role 3' } as IRole)
    ];
};

const generateToken = (userId: string, roleId: string, expiresIn = 24 * 60 * 60) => {
    return jwt.sign({ roleId }, AUTH_SECRET_OR_PRIVATE_KEY, {
        issuer: PROJECT_NAME,
        subject: userId,
        audience: `${PROTOTYPE}://${DOMAIN}`,
        expiresIn,
        algorithm: AUTH_SIGNATURE
    } as jwt.SignOptions);
};

describe('Auth - Authenticate user', () => {
    const sandbox = createSandbox();
    let list: Role[];

    beforeEach(() => {
        list = generateRoles();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Authenticate user without token', async () => {
        const param = new JwtAuthUserQuery();

        const result = await jwtAuthUserQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_REQUIRED, 'token'));
    });

    it('Authenticate user with token is invalid', async () => {
        const param = new JwtAuthUserQuery();
        param.token = 'test';

        const result = await jwtAuthUserQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_INVALID, 'token'));
    });

    it('Authenticate user with token is expired', async () => {
        sandbox.stub(jwtAuthService, 'verify').throws({ name: 'TokenExpiredError' });
        const param = new JwtAuthUserQuery();
        param.token = generateToken(uuid.v4(), uuid.v4(), -1);

        const result = await jwtAuthUserQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token'));
    });

    it('Authenticate user with something is wrong', async () => {
        sandbox.stub(jwtAuthService, 'verify').throws(new Error());
        const param = new JwtAuthUserQuery();
        param.token = generateToken(uuid.v4(), uuid.v4());

        const result = await jwtAuthUserQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.SOMETHING_WRONG));
    });

    it('Authenticate user with user info is invalid', async () => {
        const userId = uuid.v4();
        sandbox.stub(jwtAuthService, 'verify').returns({ sub: userId } as IJwtPayloadExtend);
        const param = new JwtAuthUserQuery();
        param.token = generateToken(userId, uuid.v4());

        const result = await jwtAuthUserQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_INVALID, 'token'));
    });

    it('Authenticate user with specific role access denied', async () => {
        const userId = uuid.v4();
        const roleId = uuid.v4();
        sandbox.stub(jwtAuthService, 'verify').returns({ sub: userId, roleId } as IJwtPayloadExtend);
        const param = new JwtAuthUserQuery();
        param.token = generateToken(userId, roleId);
        param.roleIds = [uuid.v4(), uuid.v4()];

        const result = await jwtAuthUserQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.ACCESS_DENIED));
    });

    it('Authenticate user successfully', async () => {
        const userId = uuid.v4();
        const roleId = uuid.v4();
        list.push(new Role({ id: roleId, name: 'Role 4' } as IRole));
        sandbox.stub(jwtAuthService, 'verify').returns({ sub: userId, roleId } as IJwtPayloadExtend);
        sandbox.stub(roleRepository, 'getAll').resolves(list);
        const param = new JwtAuthUserQuery();
        param.token = generateToken(userId, roleId);
        param.roleIds = [roleId, uuid.v4()];

        const result = await jwtAuthUserQueryHandler.handle(param);
        expect(result).to.include({ userId });
    });
});
