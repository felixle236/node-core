/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Server } from 'http';
import { API_PRIVATE_KEY } from '@configs/Configuration';
import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockAuthentication } from '@shared/test/MockAuthentication';
import { mockWebApi } from '@shared/test/MockWebApi';
import { GetListOnlineStatusByIdsQueryHandler } from '@usecases/user/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryHandler';
import { GetListOnlineStatusByIdsQueryOutput } from '@usecases/user/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('User controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3301;
    const endpoint = `http://localhost:${port}/api/v1/users`;
    const options = { headers: { Authorization: 'Bearer token' } };
    let getListOnlineStatusByIdsQueryHandler: GetListOnlineStatusByIdsQueryHandler;

    before(done => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const UserController = require('./UserController').UserController;
        server = mockWebApi(UserController, port, () => {
            Container.set(GetListOnlineStatusByIdsQueryHandler, { handle() {} });
            getListOnlineStatusByIdsQueryHandler = Container.get(GetListOnlineStatusByIdsQueryHandler);

            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        Container.reset();
        server.close(done);
    });

    it('Get list online status with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint + '/list-online-status').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get list online status with no param', async () => {
        mockAuthentication({ userId: randomUUID(), roleId: randomUUID() } as any);
        const { status, data } = await axios.get(endpoint + '/list-online-status', options).catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new InputValidationError().code);
    });

    it('Get list online status with more than 100 params', async () => {
        mockAuthentication({ userId: randomUUID(), roleId: randomUUID() } as any);

        let params = '';
        for (let i = 0; i < 101; i++)
            params += `ids[]=${randomUUID()}&`;

        const { status, data } = await axios.get(endpoint + '/list-online-status?' + params, options).catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new InputValidationError().code);
    });

    it('Get list online status', async () => {
        mockAuthentication({ userId: randomUUID(), roleId: randomUUID() } as any);
        const result = new GetListOnlineStatusByIdsQueryOutput();
        result.setData([{
            id: randomUUID(),
            isOnline: true,
            onlineAt: new Date()
        }, {
            id: randomUUID(),
            isOnline: true,
            onlineAt: new Date()
        }]);
        sandbox.stub(getListOnlineStatusByIdsQueryHandler, 'handle').resolves(result);

        const { status, data } = await axios.get(endpoint + `/list-online-status?ids[]=${randomUUID()}&ids[]=${randomUUID()}`, options);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Test API private with access denied error', async () => {
        const options = { headers: { 'x-private-key': '123' } };
        const { status, data } = await axios.get(endpoint + '/api-private', options).catch(error => error.response);

        expect(status).to.eq(403);
        expect(data.code).to.eq(new AccessDeniedError().code);
    });

    it('Test API private successful', async () => {
        const options = { headers: { 'x-private-key': API_PRIVATE_KEY } };
        const { status, data } = await axios.get(endpoint + '/api-private', options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
