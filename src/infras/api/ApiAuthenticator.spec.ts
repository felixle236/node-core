/* eslint-disable @typescript-eslint/no-empty-function */
import 'mocha';
import { randomUUID } from 'crypto';
import { AuthType } from '@domain/enums/auth/AuthType';
import { RoleId } from '@domain/enums/user/RoleId';
import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockJwtToken } from '@shared/test/MockAuthentication';
import { mockHttpRequest } from '@shared/test/MockWebApi';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryOutput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryOutput';
import { expect } from 'chai';
import { Action } from 'routing-controllers';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ApiAuthenticator } from './ApiAuthenticator';

describe('Api authenticator', () => {
    const sandbox = createSandbox();
    let getUserAuthByJwtQueryHandler: GetUserAuthByJwtQueryHandler;
    const action = {
        request: {
            headers: {
                authorization: ''
            }
        }
    } as Action;

    before(() => {
        mockHttpRequest(action.request);
        Container.set(GetUserAuthByJwtQueryHandler, { handle() {} });

        getUserAuthByJwtQueryHandler = Container.get(GetUserAuthByJwtQueryHandler);
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
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: randomUUID(),
            roleId: RoleId.Client,
            type: AuthType.PersonalEmail
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);
        const error: AccessDeniedError = await ApiAuthenticator.authorizationChecker(action, [RoleId.Manager]).catch(error => error);
        const err = new AccessDeniedError();

        expect(error.httpCode).to.eq(err.httpCode);
        expect(error.message).to.eq(err.message);
    });

    it('Authorize success without checking role', async () => {
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: randomUUID(),
            roleId: RoleId.Client,
            type: AuthType.PersonalEmail
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);
        const isSucceed = await ApiAuthenticator.authorizationChecker(action, []);

        expect(isSucceed).to.eq(true);
    });

    it('Authorize success with checking role', async () => {
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: randomUUID(),
            roleId: RoleId.Client,
            type: AuthType.PersonalEmail
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);
        const isSucceed = await ApiAuthenticator.authorizationChecker(action, [RoleId.Client]);

        expect(isSucceed).to.eq(true);
    });

    it('Authorize success and get current user authorized', async () => {
        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: randomUUID(),
            roleId: RoleId.Client,
            type: AuthType.PersonalEmail
        });
        sandbox.stub(getUserAuthByJwtQueryHandler, 'handle').resolves(result);
        await ApiAuthenticator.authorizationChecker(action, []);
        const currentUser = ApiAuthenticator.currentUserChecker(action);

        expect(currentUser && currentUser.type).to.eq(result.data.type);
        expect(currentUser && currentUser.userId).to.eq(result.data.userId);
        expect(currentUser && currentUser.roleId).to.eq(result.data.roleId);
    });
});
