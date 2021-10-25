import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Server } from 'http';
import { RoleId } from '@domain/enums/user/RoleId';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockUserAuthentication } from '@shared/test/MockAuthentication';
import { mockAuthJwtService } from '@shared/test/MockAuthJwtService';
import { mockUsecase } from '@shared/test/MockUsecase';
import { mockWebApi } from '@shared/test/MockWebApi';
import { ArchiveManagerHandler } from '@usecases/user/manager/archive-manager/ArchiveManagerHandler';
import { ArchiveManagerOutput } from '@usecases/user/manager/archive-manager/ArchiveManagerOutput';
import { CreateManagerHandler } from '@usecases/user/manager/create-manager/CreateManagerHandler';
import { CreateManagerOutput } from '@usecases/user/manager/create-manager/CreateManagerOutput';
import { DeleteManagerHandler } from '@usecases/user/manager/delete-manager/DeleteManagerHandler';
import { DeleteManagerOutput } from '@usecases/user/manager/delete-manager/DeleteManagerOutput';
import { FindManagerHandler } from '@usecases/user/manager/find-manager/FindManagerHandler';
import { FindManagerData, FindManagerOutput } from '@usecases/user/manager/find-manager/FindManagerOutput';
import { GetManagerHandler } from '@usecases/user/manager/get-manager/GetManagerHandler';
import { GetManagerData, GetManagerOutput } from '@usecases/user/manager/get-manager/GetManagerOutput';
import { GetMyProfileManagerHandler } from '@usecases/user/manager/get-my-profile-manager/GetMyProfileManagerHandler';
import { GetMyProfileManagerData, GetMyProfileManagerOutput } from '@usecases/user/manager/get-my-profile-manager/GetMyProfileManagerOutput';
import { UpdateManagerHandler } from '@usecases/user/manager/update-manager/UpdateManagerHandler';
import { UpdateManagerOutput } from '@usecases/user/manager/update-manager/UpdateManagerOutput';
import { UpdateMyProfileManagerHandler } from '@usecases/user/manager/update-my-profile-manager/UpdateMyProfileManagerHandler';
import { UpdateMyProfileManagerOutput } from '@usecases/user/manager/update-my-profile-manager/UpdateMyProfileManagerOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('Manager controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3301;
    const endpoint = `http://localhost:${port}/api/v1/managers`;
    const options = { headers: { authorization: 'Bearer token' } };
    let findManagerHandler: FindManagerHandler;
    let getManagerHandler: GetManagerHandler;
    let getMyProfileManagerHandler: GetMyProfileManagerHandler;
    let createManagerHandler: CreateManagerHandler;
    let updateManagerHandler: UpdateManagerHandler;
    let updateMyProfileManagerHandler: UpdateMyProfileManagerHandler;
    let deleteManagerHandler: DeleteManagerHandler;
    let archiveManagerHandler: ArchiveManagerHandler;

    before(done => {
        Container.set('auth_jwt.service', mockAuthJwtService());

        import('./ManagerController').then(obj => {
            server = mockWebApi(obj.ManagerController, port, () => {
                Container.set(FindManagerHandler, mockUsecase());
                Container.set(GetManagerHandler, mockUsecase());
                Container.set(GetMyProfileManagerHandler, mockUsecase());
                Container.set(CreateManagerHandler, mockUsecase());
                Container.set(UpdateManagerHandler, mockUsecase());
                Container.set(UpdateMyProfileManagerHandler, mockUsecase());
                Container.set(DeleteManagerHandler, mockUsecase());
                Container.set(ArchiveManagerHandler, mockUsecase());

                findManagerHandler = Container.get(FindManagerHandler);
                getManagerHandler = Container.get(GetManagerHandler);
                getMyProfileManagerHandler = Container.get(GetMyProfileManagerHandler);
                createManagerHandler = Container.get(CreateManagerHandler);
                updateManagerHandler = Container.get(UpdateManagerHandler);
                updateMyProfileManagerHandler = Container.get(UpdateMyProfileManagerHandler);
                deleteManagerHandler = Container.get(DeleteManagerHandler);
                archiveManagerHandler = Container.get(ArchiveManagerHandler);

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

    it('Find managers with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Find managers by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const d = new FindManagerData();
        d.id = randomUUID();
        const result = new FindManagerOutput();
        result.data = [d];

        sandbox.stub(findManagerHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint, options);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Get manager with unauthorized error', async () => {
        const id = randomUUID();
        const { status, data } = await axios.get(endpoint + '/' + id).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get manager by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const d = new GetManagerData();
        d.id = randomUUID();
        const result = new GetManagerOutput();
        result.data = d;

        sandbox.stub(getManagerHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint + '/' + d.id, options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(d.id);
    });

    it('Get my profile with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint + '/my-profile').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get my profile by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const d = new GetMyProfileManagerData();
        d.id = randomUUID();
        const result = new GetMyProfileManagerOutput();
        result.data = d;

        sandbox.stub(getMyProfileManagerHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint + '/my-profile', options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(d.id);
    });

    it('Get my profile by manager', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Manager });
        const d = new GetMyProfileManagerData();
        d.id = randomUUID();
        const result = new GetMyProfileManagerOutput();
        result.data = d;

        sandbox.stub(getMyProfileManagerHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint + '/my-profile', options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(d.id);
    });

    it('Create manager with unauthorized error', async () => {
        const { status, data } = await axios.post(endpoint, {
            firstName: 'manager',
            lastName: 'test',
            email: 'manager.test@localhost.com',
            password: 'Nodecore@2'
        }).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Create manager by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new CreateManagerOutput();
        result.data = randomUUID();
        sandbox.stub(createManagerHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint, {
            firstName: 'manager',
            lastName: 'test',
            email: 'manager.test@localhost.com',
            password: 'Nodecore@2'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(result.data);
    });

    it('Update manager with unauthorized error', async () => {
        const { status, data } = await axios.put(endpoint + '/' + randomUUID(), {
            firstName: 'manager',
            lastName: 'test'
        }).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Update manager by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new UpdateManagerOutput();
        result.data = true;
        sandbox.stub(updateManagerHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.put(endpoint + '/' + randomUUID(), {
            firstName: 'manager',
            lastName: 'test'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Update my manager profile with unauthorized error', async () => {
        const { status, data } = await axios.put(endpoint + '/my-profile', {
            firstName: 'manager',
            lastName: 'test'
        }).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Update my manager profile by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new UpdateMyProfileManagerOutput();
        result.data = true;
        sandbox.stub(updateMyProfileManagerHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.put(endpoint + '/my-profile', {
            firstName: 'manager',
            lastName: 'test'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Update my manager profile by manager', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Manager });
        const result = new UpdateMyProfileManagerOutput();
        result.data = true;
        sandbox.stub(updateMyProfileManagerHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.put(endpoint + '/my-profile', {
            firstName: 'manager',
            lastName: 'test'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Delete manager with unauthorized error', async () => {
        const { status, data } = await axios.delete(endpoint + '/' + randomUUID()).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Delete manager by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new DeleteManagerOutput();
        result.data = true;
        sandbox.stub(deleteManagerHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.delete(endpoint + '/' + randomUUID(), options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Archive manager with unauthorized error', async () => {
        const { status, data } = await axios.post(endpoint + '/' + randomUUID() + '/archive').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Archive manager by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new ArchiveManagerOutput();
        result.data = true;
        sandbox.stub(archiveManagerHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.post(endpoint + '/' + randomUUID() + '/archive', undefined, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
