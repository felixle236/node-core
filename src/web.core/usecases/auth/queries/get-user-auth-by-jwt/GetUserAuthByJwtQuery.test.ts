import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import * as jwt from 'jsonwebtoken';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { GetUserAuthByJwtQuery } from './GetUserAuthByJwtQuery';
import { GetUserAuthByJwtQueryHandler } from './GetUserAuthByJwtQueryHandler';
import { AUTH_SECRET_OR_PRIVATE_KEY, AUTH_SIGNATURE, DOMAIN, PROJECT_NAME, PROTOTYPE } from '../../../../../configs/Configuration';
import { AccessDeniedError } from '../../../../domain/common/exceptions/AccessDeniedError';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { UnauthorizedError } from '../../../../domain/common/exceptions/UnauthorizedError';
import { Role } from '../../../../domain/entities/role/Role';
import { IRole } from '../../../../domain/types/role/IRole';
import { IRoleRepository } from '../../../../gateways/repositories/role/IRoleRepository';
import { IAuthJwtService, IJwtPayloadExtend } from '../../../../gateways/services/IAuthJwtService';

Container.set('role.repository', {
    async getAll() {}
});
Container.set('auth_jwt.service', {
    async verify() {}
});

const roleRepository = Container.get<IRoleRepository>('role.repository');
const authJwtService = Container.get<IAuthJwtService>('auth_jwt.service');
const getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);

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

describe('Authentication - Get user authentication by JWT', () => {
    const sandbox = createSandbox();
    let list: Role[];

    beforeEach(() => {
        list = generateRoles();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Get user authentication without token', async () => {
        const param = new GetUserAuthByJwtQuery();

        const result = await getUserAuthByJwtQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_REQUIRED, 'token'));
    });

    it('Get user authentication with token is invalid', async () => {
        const param = new GetUserAuthByJwtQuery();
        param.token = 'test';

        const result = await getUserAuthByJwtQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_INVALID, 'token'));
    });

    it('Get user authentication with token is expired', async () => {
        sandbox.stub(authJwtService, 'verify').throws({ name: 'TokenExpiredError' });
        const param = new GetUserAuthByJwtQuery();
        param.token = generateToken(uuid.v4(), uuid.v4(), -1);

        const result = await getUserAuthByJwtQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token'));
    });

    it('Get user authentication with something is wrong', async () => {
        sandbox.stub(authJwtService, 'verify').throws(new Error());
        const param = new GetUserAuthByJwtQuery();
        param.token = generateToken(uuid.v4(), uuid.v4());

        const result = await getUserAuthByJwtQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_INVALID, 'token'));
    });

    it('Get user authentication with user info is invalid', async () => {
        const userId = uuid.v4();
        sandbox.stub(authJwtService, 'verify').returns({ sub: userId } as IJwtPayloadExtend);
        const param = new GetUserAuthByJwtQuery();
        param.token = generateToken(userId, uuid.v4());

        const result = await getUserAuthByJwtQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new UnauthorizedError(MessageError.PARAM_INVALID, 'token payload'));
    });

    it('Get user authentication with specific role access denied', async () => {
        const userId = uuid.v4();
        const roleId = uuid.v4();
        sandbox.stub(authJwtService, 'verify').returns({ sub: userId, roleId } as IJwtPayloadExtend);
        const param = new GetUserAuthByJwtQuery();
        param.token = generateToken(userId, roleId);
        param.roleIds = [uuid.v4(), uuid.v4()];

        const result = await getUserAuthByJwtQueryHandler.handle(param).catch(error => error);
        expect(result).to.include(new AccessDeniedError());
    });

    it('Get user authentication successfully', async () => {
        const userId = uuid.v4();
        const roleId = uuid.v4();
        list.push(new Role({ id: roleId, name: 'Role 4' } as IRole));
        sandbox.stub(authJwtService, 'verify').returns({ sub: userId, roleId } as IJwtPayloadExtend);
        sandbox.stub(roleRepository, 'getAll').resolves(list);
        const param = new GetUserAuthByJwtQuery();
        param.token = generateToken(userId, roleId);
        param.roleIds = [roleId, uuid.v4()];

        const result = await getUserAuthByJwtQueryHandler.handle(param);
        expect(result).to.include({ userId });
    });
});
