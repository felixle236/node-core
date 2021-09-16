/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthJwtService, IJwtPayloadExtend } from '@gateways/services/IAuthJwtService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { TraceRequest } from '@shared/request/TraceRequest';
import { mockJwtToken } from '@shared/test/MockAuthentication';
import { mockAuthJwtService } from '@shared/test/MockAuthJwtService';
import { mockLogService } from '@shared/test/MockLogService';
import { HandleOption } from '@shared/usecase/HandleOption';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { GetUserAuthByJwtQueryHandler } from './GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryInput } from './GetUserAuthByJwtQueryInput';

describe('Authorization usecases - Get user authorization by JWT', () => {
    const sandbox = createSandbox();
    let authJwtService: IAuthJwtService;
    let getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler;
    let param: GetUserAuthByJwtQueryInput;
    const handleOption = new HandleOption();
    handleOption.trace = new TraceRequest();

    before(() => {
        Container.set('auth_jwt.service', mockAuthJwtService());
        Container.set('log.service', mockLogService());

        authJwtService = Container.get<IAuthJwtService>('auth_jwt.service');
        getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
    });

    beforeEach(() => {
        param = new GetUserAuthByJwtQueryInput();
        param.token = mockJwtToken();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Get user authorization by JWT with token is expired error', async () => {
        const errTest = new Error();
        errTest.name = 'TokenExpiredError';
        sandbox.stub(authJwtService, 'verify').throwsException(errTest);

        const error: SystemError = await getUserAuthByJwtQueryHandler.handle(param, handleOption).catch(error => error);
        const err = new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get user authorization by JWT with token is invalid error', async () => {
        sandbox.stub(authJwtService, 'verify').throwsException(new Error());

        const error: SystemError = await getUserAuthByJwtQueryHandler.handle(param, handleOption).catch(error => error);
        const err = new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get user authorization by JWT with token payload is invalid error', async () => {
        sandbox.stub(authJwtService, 'verify').returns({} as IJwtPayloadExtend);

        const error: SystemError = await getUserAuthByJwtQueryHandler.handle(param, handleOption).catch(error => error);
        const err = new UnauthorizedError(MessageError.PARAM_INVALID, 'token payload');

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Get user authorization by JWT', async () => {
        const userId = randomUUID();
        const roleId = randomUUID();
        const type = AuthType.PersonalEmail;
        sandbox.stub(authJwtService, 'verify').returns({
            sub: userId,
            roleId,
            type
        } as any);

        const result = await getUserAuthByJwtQueryHandler.handle(param, handleOption);
        expect(result.data).to.not.eq(null);
        expect(result.data.userId).to.eq(userId);
        expect(result.data.roleId).to.eq(roleId);
        expect(result.data.type).to.eq(type);
    });
});
