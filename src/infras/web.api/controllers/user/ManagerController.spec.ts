/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Server } from 'http';
import { RoleId } from '@domain/enums/user/RoleId';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockAuthentication } from '@shared/test/MockAuthentication';
import { mockApiService } from '@shared/test/MockWebApi';
import { ArchiveManagerCommandHandler } from '@usecases/user/manager/commands/archive-manager/ArchiveManagerCommandHandler';
import { ArchiveManagerCommandOutput } from '@usecases/user/manager/commands/archive-manager/ArchiveManagerCommandOutput';
import { CreateManagerCommandHandler } from '@usecases/user/manager/commands/create-manager/CreateManagerCommandHandler';
import { CreateManagerCommandOutput } from '@usecases/user/manager/commands/create-manager/CreateManagerCommandOutput';
import { DeleteManagerCommandHandler } from '@usecases/user/manager/commands/delete-manager/DeleteManagerCommandHandler';
import { DeleteManagerCommandOutput } from '@usecases/user/manager/commands/delete-manager/DeleteManagerCommandOutput';
import { UpdateManagerCommandHandler } from '@usecases/user/manager/commands/update-manager/UpdateManagerCommandHandler';
import { UpdateManagerCommandOutput } from '@usecases/user/manager/commands/update-manager/UpdateManagerCommandOutput';
import { UpdateMyProfileManagerCommandHandler } from '@usecases/user/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandHandler';
import { UpdateMyProfileManagerCommandOutput } from '@usecases/user/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandOutput';
import { FindManagerQueryHandler } from '@usecases/user/manager/queries/find-manager/FindManagerQueryHandler';
import { FindManagerQueryOutput } from '@usecases/user/manager/queries/find-manager/FindManagerQueryOutput';
import { GetManagerByIdQueryHandler } from '@usecases/user/manager/queries/get-manager-by-id/GetManagerByIdQueryHandler';
import { GetManagerByIdQueryOutput } from '@usecases/user/manager/queries/get-manager-by-id/GetManagerByIdQueryOutput';
import { GetMyProfileManagerQueryHandler } from '@usecases/user/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryHandler';
import { GetMyProfileManagerQueryOutput } from '@usecases/user/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';

describe('Manager controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3456;
    const endpoint = `http://localhost:${port}/api/v1/managers`;
    const options = { headers: { Authorization: 'Bearer token' } };
    let findManagerQueryHandler: FindManagerQueryHandler;
    let getManagerByIdQueryHandler: GetManagerByIdQueryHandler;
    let getMyProfileManagerQueryHandler: GetMyProfileManagerQueryHandler;
    let createManagerCommandHandler: CreateManagerCommandHandler;
    let updateManagerCommandHandler: UpdateManagerCommandHandler;
    let updateMyProfileManagerCommandHandler: UpdateMyProfileManagerCommandHandler;
    let deleteManagerCommandHandler: DeleteManagerCommandHandler;
    let archiveManagerCommandHandler: ArchiveManagerCommandHandler;

    before(done => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ManagerController = require('./ManagerController').ManagerController;
        server = mockApiService(ManagerController, port, () => {
            Container.set(FindManagerQueryHandler, { handle() {} });
            Container.set(GetManagerByIdQueryHandler, { handle() {} });
            Container.set(GetMyProfileManagerQueryHandler, { handle() {} });
            Container.set(CreateManagerCommandHandler, { handle() {} });
            Container.set(UpdateManagerCommandHandler, { handle() {} });
            Container.set(UpdateMyProfileManagerCommandHandler, { handle() {} });
            Container.set(DeleteManagerCommandHandler, { handle() {} });
            Container.set(ArchiveManagerCommandHandler, { handle() {} });

            findManagerQueryHandler = Container.get(FindManagerQueryHandler);
            getManagerByIdQueryHandler = Container.get(GetManagerByIdQueryHandler);
            getMyProfileManagerQueryHandler = Container.get(GetMyProfileManagerQueryHandler);
            createManagerCommandHandler = Container.get(CreateManagerCommandHandler);
            updateManagerCommandHandler = Container.get(UpdateManagerCommandHandler);
            updateMyProfileManagerCommandHandler = Container.get(UpdateMyProfileManagerCommandHandler);
            deleteManagerCommandHandler = Container.get(DeleteManagerCommandHandler);
            archiveManagerCommandHandler = Container.get(ArchiveManagerCommandHandler);

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

    it('Find managers with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Find managers by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new FindManagerQueryOutput();
        result.setData([{
            id: v4()
        }] as any);
        sandbox.stub(findManagerQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint, options);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Get manager with unauthorized error', async () => {
        const id = v4();
        const { status, data } = await axios.get(endpoint + '/' + id).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get manager by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const id = v4();
        const result = new GetManagerByIdQueryOutput();
        result.setData({
            id
        } as any);
        sandbox.stub(getManagerByIdQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint + '/' + id, options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(id);
    });

    it('Get my profile with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint + '/my-profile').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get my profile by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const id = v4();
        const result = new GetMyProfileManagerQueryOutput();
        result.setData({
            id
        } as any);
        sandbox.stub(getMyProfileManagerQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint + '/my-profile', options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(id);
    });

    it('Get my profile by manager', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.MANAGER } as any);
        const id = v4();
        const result = new GetMyProfileManagerQueryOutput();
        result.setData({
            id
        } as any);
        sandbox.stub(getMyProfileManagerQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint + '/my-profile', options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(id);
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
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const id = v4();
        const result = new CreateManagerCommandOutput();
        result.setData(id);
        sandbox.stub(createManagerCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint, {
            firstName: 'manager',
            lastName: 'test',
            email: 'manager.test@localhost.com',
            password: 'Nodecore@2'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(id);
    });

    it('Update manager with unauthorized error', async () => {
        const { status, data } = await axios.put(endpoint + '/' + v4(), {
            firstName: 'manager',
            lastName: 'test'
        }).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Update manager by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new UpdateManagerCommandOutput();
        result.setData(true);
        sandbox.stub(updateManagerCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.put(endpoint + '/' + v4(), {
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
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new UpdateMyProfileManagerCommandOutput();
        result.setData(true);
        sandbox.stub(updateMyProfileManagerCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.put(endpoint + '/my-profile', {
            firstName: 'manager',
            lastName: 'test'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Update my manager profile by manager', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.MANAGER } as any);
        const result = new UpdateMyProfileManagerCommandOutput();
        result.setData(true);
        sandbox.stub(updateMyProfileManagerCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.put(endpoint + '/my-profile', {
            firstName: 'manager',
            lastName: 'test'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Delete manager with unauthorized error', async () => {
        const { status, data } = await axios.delete(endpoint + '/' + v4()).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Delete manager by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new DeleteManagerCommandOutput();
        result.setData(true);
        sandbox.stub(deleteManagerCommandHandler, 'handle').resolves(result);
        const { status, data } = await axios.delete(endpoint + '/' + v4(), options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Archive manager with unauthorized error', async () => {
        const { status, data } = await axios.post(endpoint + '/' + v4() + '/archive').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Archive manager by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new ArchiveManagerCommandOutput();
        result.setData(true);
        sandbox.stub(archiveManagerCommandHandler, 'handle').resolves(result);
        const { status, data } = await axios.post(endpoint + '/' + v4() + '/archive', undefined, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
