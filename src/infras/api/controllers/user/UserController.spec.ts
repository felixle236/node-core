import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Server } from 'http';
import { API_PRIVATE_KEY } from '@configs/Configuration';
import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockUserAuthentication } from '@shared/test/MockAuthentication';
import { mockAuthJwtService } from '@shared/test/MockAuthJwtService';
import { mockUsecase } from '@shared/test/MockUsecase';
import { mockWebApi } from '@shared/test/MockWebApi';
import { GetListOnlineStatusByIdsHandler } from '@usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsHandler';
import { GetListOnlineStatusByIdsData, GetListOnlineStatusByIdsOutput } from '@usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('User controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3301;
    const endpoint = `http://localhost:${port}/api/v1/users`;
    const options = { headers: { authorization: 'Bearer token' } };
    let getListOnlineStatusByIdsHandler: GetListOnlineStatusByIdsHandler;

    before(done => {
        Container.set('auth_jwt.service', mockAuthJwtService());

        import('./UserController').then(obj => {
            server = mockWebApi(obj.UserController, port, () => {
                Container.set(GetListOnlineStatusByIdsHandler, mockUsecase());
                getListOnlineStatusByIdsHandler = Container.get(GetListOnlineStatusByIdsHandler);

                done();
            });
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
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });
        const { status, data } = await axios.get(endpoint + '/list-online-status', options).catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new InputValidationError().code);
    });

    it('Get list online status with more than 100 params', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });

        let params = '';
        for (let i = 0; i < 101; i++)
            params += `ids[]=${randomUUID()}&`;

        const { status, data } = await axios.get(endpoint + '/list-online-status?' + params, options).catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new InputValidationError().code);
    });

    it('Get list online status', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });
        const d = new GetListOnlineStatusByIdsData();
        d.id = randomUUID();
        d.isOnline = true;
        d.onlineAt = new Date();

        const d2 = new GetListOnlineStatusByIdsData();
        d2.id = randomUUID();
        d2.isOnline = true;
        d2.onlineAt = new Date();

        const result = new GetListOnlineStatusByIdsOutput();
        result.data = [d, d2];
        sandbox.stub(getListOnlineStatusByIdsHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.get(endpoint + `/list-online-status?ids[]=${randomUUID()}&ids[]=${randomUUID()}`, options);

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
        const { status, data }: any = await axios.get(endpoint + '/api-private', options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
