import 'mocha';
import { randomUUID } from 'crypto';
import { AuthType } from 'domain/enums/auth/AuthType';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { GetUserAuthByJwtHandler } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { GetUserAuthByJwtData, GetUserAuthByJwtOutput } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtOutput';
import { expect } from 'chai';
import { Action } from 'routing-controllers';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { mockJwtToken } from 'shared/test/MockAuthentication';
import { mockAuthJwtService } from 'shared/test/MockAuthJwtService';
import { mockInjection, mockUsecaseInjection } from 'shared/test/MockInjection';
import { mockHttpRequest } from 'shared/test/MockWebApi';
import { InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ApiAuthenticator } from './ApiAuthenticator';

describe('Api authenticator', () => {
    const sandbox = createSandbox();
    let authJwtService: IAuthJwtService;
    let getUserAuthByJwtHandler: GetUserAuthByJwtHandler;
    const action = {
        request: {
            headers: {
                authorization: ''
            }
        }
    } as Action;

    before(() => {
        mockHttpRequest(action.request);
        authJwtService = mockInjection(InjectService.AuthJwt, mockAuthJwtService());
        getUserAuthByJwtHandler = mockUsecaseInjection(GetUserAuthByJwtHandler);
    });

    beforeEach(() => {
        action.request.headers.authorization = 'Bearer ' + mockJwtToken();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Authorize with unauthorized error', async () => {
        action.request.headers.authorization = '';
        const error: UnauthorizedError = await ApiAuthenticator.authorizationChecker(action, []).catch(error => error);
        const err = new UnauthorizedError();

        expect(error.httpCode).to.eq(err.httpCode);
        expect(error.message).to.eq(err.message);
    });

    it('Authorize with access denied error', async () => {
        sandbox.stub(authJwtService, 'getTokenFromHeader').returns(mockJwtToken());
        const d = new GetUserAuthByJwtData();
        d.userId = randomUUID();
        d.roleId = RoleId.Client;
        d.type = AuthType.PersonalEmail;

        const result = new GetUserAuthByJwtOutput();
        result.data = d;

        sandbox.stub(getUserAuthByJwtHandler, 'handle').resolves(result);
        const error: AccessDeniedError = await ApiAuthenticator.authorizationChecker(action, [RoleId.Manager]).catch(error => error);
        const err = new AccessDeniedError();

        expect(error.httpCode).to.eq(err.httpCode);
        expect(error.message).to.eq(err.message);
    });

    it('Authorize success without checking role', async () => {
        sandbox.stub(authJwtService, 'getTokenFromHeader').returns(mockJwtToken());
        const d = new GetUserAuthByJwtData();
        d.userId = randomUUID();
        d.roleId = RoleId.Client;
        d.type = AuthType.PersonalEmail;

        const result = new GetUserAuthByJwtOutput();
        result.data = d;

        sandbox.stub(getUserAuthByJwtHandler, 'handle').resolves(result);
        const isSucceed = await ApiAuthenticator.authorizationChecker(action, []);

        expect(isSucceed).to.eq(true);
    });

    it('Authorize success with checking role', async () => {
        sandbox.stub(authJwtService, 'getTokenFromHeader').returns(mockJwtToken());
        const d = new GetUserAuthByJwtData();
        d.userId = randomUUID();
        d.roleId = RoleId.Client;
        d.type = AuthType.PersonalEmail;

        const result = new GetUserAuthByJwtOutput();
        result.data = d;
        sandbox.stub(getUserAuthByJwtHandler, 'handle').resolves(result);
        const isSucceed = await ApiAuthenticator.authorizationChecker(action, [RoleId.Client]);

        expect(isSucceed).to.eq(true);
    });

    it('Authorize success and get current user authorized', async () => {
        sandbox.stub(authJwtService, 'getTokenFromHeader').returns(mockJwtToken());
        const d = new GetUserAuthByJwtData();
        d.userId = randomUUID();
        d.roleId = RoleId.Client;
        d.type = AuthType.PersonalEmail;

        const result = new GetUserAuthByJwtOutput();
        result.data = d;
        sandbox.stub(getUserAuthByJwtHandler, 'handle').resolves(result);
        await ApiAuthenticator.authorizationChecker(action, []);
        const currentUser = ApiAuthenticator.currentUserChecker(action);

        expect(currentUser && currentUser.type).to.eq(result.data.type);
        expect(currentUser && currentUser.userId).to.eq(result.data.userId);
        expect(currentUser && currentUser.roleId).to.eq(result.data.roleId);
    });
});
