/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Server } from 'http';
import { RoleId } from '@domain/enums/user/RoleId';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockAuthentication } from '@shared/test/MockAuthentication';
import { mockApiService } from '@shared/test/MockWebApi';
import { ActiveClientCommandHandler } from '@usecases/user/client/commands/active-client/ActiveClientCommandHandler';
import { ActiveClientCommandOutput } from '@usecases/user/client/commands/active-client/ActiveClientCommandOutput';
import { ArchiveClientCommandHandler } from '@usecases/user/client/commands/archive-client/ArchiveClientCommandHandler';
import { ArchiveClientCommandOutput } from '@usecases/user/client/commands/archive-client/ArchiveClientCommandOutput';
import { CreateClientCommandHandler } from '@usecases/user/client/commands/create-client/CreateClientCommandHandler';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { DeleteClientCommandHandler } from '@usecases/user/client/commands/delete-client/DeleteClientCommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { RegisterClientCommandHandler } from '@usecases/user/client/commands/register-client/RegisterClientCommandHandler';
import { RegisterClientCommandOutput } from '@usecases/user/client/commands/register-client/RegisterClientCommandOutput';
import { ResendActivationCommandHandler } from '@usecases/user/client/commands/resend-activation/ResendActivationCommandHandler';
import { ResendActivationCommandOutput } from '@usecases/user/client/commands/resend-activation/ResendActivationCommandOutput';
import { UpdateClientCommandHandler } from '@usecases/user/client/commands/update-client/UpdateClientCommandHandler';
import { UpdateClientCommandOutput } from '@usecases/user/client/commands/update-client/UpdateClientCommandOutput';
import { UpdateMyProfileClientCommandHandler } from '@usecases/user/client/commands/update-my-profile-client/UpdateMyProfileClientCommandHandler';
import { UpdateMyProfileClientCommandOutput } from '@usecases/user/client/commands/update-my-profile-client/UpdateMyProfileClientCommandOutput';
import { FindClientQueryHandler } from '@usecases/user/client/queries/find-client/FindClientQueryHandler';
import { FindClientQueryOutput } from '@usecases/user/client/queries/find-client/FindClientQueryOutput';
import { GetClientByIdQueryHandler } from '@usecases/user/client/queries/get-client-by-id/GetClientByIdQueryHandler';
import { GetClientByIdQueryOutput } from '@usecases/user/client/queries/get-client-by-id/GetClientByIdQueryOutput';
import { GetMyProfileClientQueryHandler } from '@usecases/user/client/queries/get-my-profile-client/GetMyProfileClientQueryHandler';
import { GetMyProfileClientQueryOutput } from '@usecases/user/client/queries/get-my-profile-client/GetMyProfileClientQueryOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';

describe('Client controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3000;
    const endpoint = `http://localhost:${port}/api/v1/clients`;
    const options = { headers: { Authorization: 'Bearer token' } };
    let findClientQueryHandler: FindClientQueryHandler;
    let getClientByIdQueryHandler: GetClientByIdQueryHandler;
    let getMyProfileClientQueryHandler: GetMyProfileClientQueryHandler;
    let registerClientCommandHandler: RegisterClientCommandHandler;
    let activeClientCommandHandler: ActiveClientCommandHandler;
    let resendActivationCommandHandler: ResendActivationCommandHandler;
    let createClientCommandHandler: CreateClientCommandHandler;
    let updateClientCommandHandler: UpdateClientCommandHandler;
    let updateMyProfileClientCommandHandler: UpdateMyProfileClientCommandHandler;
    let deleteClientCommandHandler: DeleteClientCommandHandler;
    let archiveClientCommandHandler: ArchiveClientCommandHandler;

    before(done => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ClientController = require('./ClientController').ClientController;
        server = mockApiService(ClientController, port, () => {
            Container.set(FindClientQueryHandler, { handle() {} });
            Container.set(GetClientByIdQueryHandler, { handle() {} });
            Container.set(GetMyProfileClientQueryHandler, { handle() {} });
            Container.set(RegisterClientCommandHandler, { handle() {} });
            Container.set(ActiveClientCommandHandler, { handle() {} });
            Container.set(ResendActivationCommandHandler, { handle() {} });
            Container.set(CreateClientCommandHandler, { handle() {} });
            Container.set(UpdateClientCommandHandler, { handle() {} });
            Container.set(UpdateMyProfileClientCommandHandler, { handle() {} });
            Container.set(DeleteClientCommandHandler, { handle() {} });
            Container.set(ArchiveClientCommandHandler, { handle() {} });

            findClientQueryHandler = Container.get(FindClientQueryHandler);
            getClientByIdQueryHandler = Container.get(GetClientByIdQueryHandler);
            getMyProfileClientQueryHandler = Container.get(GetMyProfileClientQueryHandler);
            registerClientCommandHandler = Container.get(RegisterClientCommandHandler);
            activeClientCommandHandler = Container.get(ActiveClientCommandHandler);
            resendActivationCommandHandler = Container.get(ResendActivationCommandHandler);
            createClientCommandHandler = Container.get(CreateClientCommandHandler);
            updateClientCommandHandler = Container.get(UpdateClientCommandHandler);
            updateMyProfileClientCommandHandler = Container.get(UpdateMyProfileClientCommandHandler);
            deleteClientCommandHandler = Container.get(DeleteClientCommandHandler);
            archiveClientCommandHandler = Container.get(ArchiveClientCommandHandler);

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

    it('Find clients with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Find clients by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new FindClientQueryOutput();
        result.setData([{
            id: v4()
        }] as any);
        sandbox.stub(findClientQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint, options);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Find clients by manager', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.MANAGER } as any);
        const result = new FindClientQueryOutput();
        result.setData([{
            id: v4()
        }] as any);
        sandbox.stub(findClientQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint, options);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Get client with unauthorized error', async () => {
        const id = v4();
        const { status, data } = await axios.get(endpoint + '/' + id).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get client by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const id = v4();
        const result = new GetClientByIdQueryOutput();
        result.setData({
            id
        } as any);
        sandbox.stub(getClientByIdQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint + '/' + id, options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(id);
    });

    it('Get client by manager', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.MANAGER } as any);
        const id = v4();
        const result = new GetClientByIdQueryOutput();
        result.setData({
            id
        } as any);
        sandbox.stub(getClientByIdQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint + '/' + id, options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(id);
    });

    it('Get my profile with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint + '/my-profile').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get my profile by client', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.CLIENT } as any);
        const id = v4();
        const result = new GetMyProfileClientQueryOutput();
        result.setData({
            id
        } as any);
        sandbox.stub(getMyProfileClientQueryHandler, 'handle').resolves(result);
        const { status, data } = await axios.get(endpoint + '/my-profile', options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(id);
    });

    it('Register new client account', async () => {
        const result = new RegisterClientCommandOutput();
        result.setData(true);
        sandbox.stub(registerClientCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/register', {
            firstName: 'client',
            lastName: 'test',
            email: 'client.test@localhost.com',
            password: 'Nodecore@2'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Active client account', async () => {
        const result = new ActiveClientCommandOutput();
        result.setData(true);
        sandbox.stub(activeClientCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/active', {
            email: 'client.test@localhost.com',
            activeKey: 'active key'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Resend activation', async () => {
        const result = new ResendActivationCommandOutput();
        result.setData(true);
        sandbox.stub(resendActivationCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint + '/resend-activation', {
            email: 'client.test@localhost.com'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Create client with unauthorized error', async () => {
        const { status, data } = await axios.post(endpoint, {
            firstName: 'client',
            lastName: 'test',
            email: 'client.test@localhost.com',
            password: 'Nodecore@2'
        }).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Create client by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const id = v4();
        const result = new CreateClientCommandOutput();
        result.setData(id);
        sandbox.stub(createClientCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.post(endpoint, {
            firstName: 'client',
            lastName: 'test',
            email: 'client.test@localhost.com',
            password: 'Nodecore@2'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(id);
    });

    it('Update client with unauthorized error', async () => {
        const { status, data } = await axios.put(endpoint + '/' + v4(), {
            firstName: 'client',
            lastName: 'test'
        }).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Update client by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new UpdateClientCommandOutput();
        result.setData(true);
        sandbox.stub(updateClientCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.put(endpoint + '/' + v4(), {
            firstName: 'client',
            lastName: 'test'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Update my client profile with unauthorized error', async () => {
        const { status, data } = await axios.put(endpoint + '/my-profile', {
            firstName: 'client',
            lastName: 'test'
        }).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Update my client profile by client', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.CLIENT } as any);
        const result = new UpdateMyProfileClientCommandOutput();
        result.setData(true);
        sandbox.stub(updateMyProfileClientCommandHandler, 'handle').resolves(result);

        const { status, data } = await axios.put(endpoint + '/my-profile', {
            firstName: 'client',
            lastName: 'test'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Delete client with unauthorized error', async () => {
        const { status, data } = await axios.delete(endpoint + '/' + v4()).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Delete client by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new DeleteClientCommandOutput();
        result.setData(true);
        sandbox.stub(deleteClientCommandHandler, 'handle').resolves(result);
        const { status, data } = await axios.delete(endpoint + '/' + v4(), options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Archive client with unauthorized error', async () => {
        const { status, data } = await axios.post(endpoint + '/' + v4() + '/archive').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Archive client by super admin', async () => {
        mockAuthentication({ userId: v4(), roleId: RoleId.SUPER_ADMIN } as any);
        const result = new ArchiveClientCommandOutput();
        result.setData(true);
        sandbox.stub(archiveClientCommandHandler, 'handle').resolves(result);
        const { status, data } = await axios.post(endpoint + '/' + v4() + '/archive', undefined, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
