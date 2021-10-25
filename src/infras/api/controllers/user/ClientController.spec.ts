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
import { ActiveClientHandler } from '@usecases/user/client/active-client/ActiveClientHandler';
import { ActiveClientOutput } from '@usecases/user/client/active-client/ActiveClientOutput';
import { ArchiveClientHandler } from '@usecases/user/client/archive-client/ArchiveClientHandler';
import { ArchiveClientOutput } from '@usecases/user/client/archive-client/ArchiveClientOutput';
import { CreateClientHandler } from '@usecases/user/client/create-client/CreateClientHandler';
import { CreateClientOutput } from '@usecases/user/client/create-client/CreateClientOutput';
import { DeleteClientHandler } from '@usecases/user/client/delete-client/DeleteClientHandler';
import { DeleteClientOutput } from '@usecases/user/client/delete-client/DeleteClientOutput';
import { FindClientHandler } from '@usecases/user/client/find-client/FindClientHandler';
import { FindClientData, FindClientOutput } from '@usecases/user/client/find-client/FindClientOutput';
import { GetClientHandler } from '@usecases/user/client/get-client/GetClientHandler';
import { GetClientData, GetClientOutput } from '@usecases/user/client/get-client/GetClientOutput';
import { GetMyProfileClientHandler } from '@usecases/user/client/get-my-profile-client/GetMyProfileClientHandler';
import { GetMyProfileClientData, GetMyProfileClientOutput } from '@usecases/user/client/get-my-profile-client/GetMyProfileClientOutput';
import { RegisterClientHandler } from '@usecases/user/client/register-client/RegisterClientHandler';
import { RegisterClientOutput } from '@usecases/user/client/register-client/RegisterClientOutput';
import { ResendActivationHandler } from '@usecases/user/client/resend-activation/ResendActivationHandler';
import { ResendActivationOutput } from '@usecases/user/client/resend-activation/ResendActivationOutput';
import { UpdateClientHandler } from '@usecases/user/client/update-client/UpdateClientHandler';
import { UpdateClientOutput } from '@usecases/user/client/update-client/UpdateClientOutput';
import { UpdateMyProfileClientHandler } from '@usecases/user/client/update-my-profile-client/UpdateMyProfileClientHandler';
import { UpdateMyProfileClientOutput } from '@usecases/user/client/update-my-profile-client/UpdateMyProfileClientOutput';
import axios from 'axios';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('Client controller', () => {
    const sandbox = createSandbox();
    let server: Server;
    const port = 3301;
    const endpoint = `http://localhost:${port}/api/v1/clients`;
    const options = { headers: { authorization: 'Bearer token' } };
    let findClientHandler: FindClientHandler;
    let getClientHandler: GetClientHandler;
    let getMyProfileClientHandler: GetMyProfileClientHandler;
    let registerClientHandler: RegisterClientHandler;
    let activeClientHandler: ActiveClientHandler;
    let resendActivationHandler: ResendActivationHandler;
    let createClientHandler: CreateClientHandler;
    let updateClientHandler: UpdateClientHandler;
    let updateMyProfileClientHandler: UpdateMyProfileClientHandler;
    let deleteClientHandler: DeleteClientHandler;
    let archiveClientHandler: ArchiveClientHandler;

    before(done => {
        Container.set('auth_jwt.service', mockAuthJwtService());

        import('./ClientController').then(obj => {
            server = mockWebApi(obj.ClientController, port, () => {
                Container.set(FindClientHandler, mockUsecase());
                Container.set(GetClientHandler, mockUsecase());
                Container.set(GetMyProfileClientHandler, mockUsecase());
                Container.set(RegisterClientHandler, mockUsecase());
                Container.set(ActiveClientHandler, mockUsecase());
                Container.set(ResendActivationHandler, mockUsecase());
                Container.set(CreateClientHandler, mockUsecase());
                Container.set(UpdateClientHandler, mockUsecase());
                Container.set(UpdateMyProfileClientHandler, mockUsecase());
                Container.set(DeleteClientHandler, mockUsecase());
                Container.set(ArchiveClientHandler, mockUsecase());

                findClientHandler = Container.get(FindClientHandler);
                getClientHandler = Container.get(GetClientHandler);
                getMyProfileClientHandler = Container.get(GetMyProfileClientHandler);
                registerClientHandler = Container.get(RegisterClientHandler);
                activeClientHandler = Container.get(ActiveClientHandler);
                resendActivationHandler = Container.get(ResendActivationHandler);
                createClientHandler = Container.get(CreateClientHandler);
                updateClientHandler = Container.get(UpdateClientHandler);
                updateMyProfileClientHandler = Container.get(UpdateMyProfileClientHandler);
                deleteClientHandler = Container.get(DeleteClientHandler);
                archiveClientHandler = Container.get(ArchiveClientHandler);

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

    it('Find clients with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Find clients by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new FindClientOutput();
        const d = new FindClientData();
        d.id = randomUUID();
        result.data = [d];

        sandbox.stub(findClientHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint, options);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Find clients by manager', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Manager });
        const result = new FindClientOutput();
        const d = new FindClientData();
        d.id = randomUUID();
        result.data = [d];

        sandbox.stub(findClientHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint, options);

        expect(status).to.eq(200);
        expect(data.data).to.not.eq(undefined);
    });

    it('Get client with unauthorized error', async () => {
        const id = randomUUID();
        const { status, data } = await axios.get(endpoint + '/' + id).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get client by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const d = new GetClientData();
        d.id = randomUUID();
        const result = new GetClientOutput();
        result.data = d;

        sandbox.stub(getClientHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint + '/' + d.id, options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(d.id);
    });

    it('Get client by manager', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Manager });
        const d = new GetClientData();
        d.id = randomUUID();
        const result = new GetClientOutput();
        result.data = d;

        sandbox.stub(getClientHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint + '/' + d.id, options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(d.id);
    });

    it('Get my profile with unauthorized error', async () => {
        const { status, data } = await axios.get(endpoint + '/my-profile').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Get my profile by client', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Client });
        const d = new GetMyProfileClientData();
        d.id = randomUUID();
        const result = new GetMyProfileClientOutput();
        result.data = d;

        sandbox.stub(getMyProfileClientHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.get(endpoint + '/my-profile', options);

        expect(status).to.eq(200);
        expect(data.data.id).to.eq(d.id);
    });

    it('Register new client account', async () => {
        const result = new RegisterClientOutput();
        result.data = true;
        sandbox.stub(registerClientHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint + '/register', {
            firstName: 'client',
            lastName: 'test',
            email: 'client.test@localhost.com',
            password: 'Nodecore@2'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Active client account', async () => {
        const result = new ActiveClientOutput();
        result.data = true;
        sandbox.stub(activeClientHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint + '/active', {
            email: 'client.test@localhost.com',
            activeKey: 'active key'
        });

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Resend activation', async () => {
        const result = new ResendActivationOutput();
        result.data = true;
        sandbox.stub(resendActivationHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint + '/resend-activation', {
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
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new CreateClientOutput();
        result.data = randomUUID();
        sandbox.stub(createClientHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.post(endpoint, {
            firstName: 'client',
            lastName: 'test',
            email: 'client.test@localhost.com',
            password: 'Nodecore@2'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(result.data);
    });

    it('Update client with unauthorized error', async () => {
        const { status, data } = await axios.put(endpoint + '/' + randomUUID(), {
            firstName: 'client',
            lastName: 'test'
        }).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Update client by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new UpdateClientOutput();
        result.data = true;
        sandbox.stub(updateClientHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.put(endpoint + '/' + randomUUID(), {
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
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Client });
        const result = new UpdateMyProfileClientOutput();
        result.data = true;
        sandbox.stub(updateMyProfileClientHandler, 'handle').resolves(result);

        const { status, data }: any = await axios.put(endpoint + '/my-profile', {
            firstName: 'client',
            lastName: 'test'
        }, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Delete client with unauthorized error', async () => {
        const { status, data } = await axios.delete(endpoint + '/' + randomUUID()).catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Delete client by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new DeleteClientOutput();
        result.data = true;
        sandbox.stub(deleteClientHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.delete(endpoint + '/' + randomUUID(), options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });

    it('Archive client with unauthorized error', async () => {
        const { status, data } = await axios.post(endpoint + '/' + randomUUID() + '/archive').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Archive client by super admin', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
        const result = new ArchiveClientOutput();
        result.data = true;
        sandbox.stub(archiveClientHandler, 'handle').resolves(result);
        const { status, data }: any = await axios.post(endpoint + '/' + randomUUID() + '/archive', undefined, options);

        expect(status).to.eq(200);
        expect(data.data).to.eq(true);
    });
});
