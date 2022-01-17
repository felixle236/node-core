import 'reflect-metadata';
import 'mocha';
import { randomUUID, randomBytes } from 'crypto';
import { RoleId } from 'domain/enums/user/RoleId';
import { Server } from 'http';
import { ActiveClientHandler } from 'application/usecases/user/client/active-client/ActiveClientHandler';
import { ActiveClientOutput } from 'application/usecases/user/client/active-client/ActiveClientOutput';
import { ArchiveClientHandler } from 'application/usecases/user/client/archive-client/ArchiveClientHandler';
import { ArchiveClientOutput } from 'application/usecases/user/client/archive-client/ArchiveClientOutput';
import { CreateClientHandler } from 'application/usecases/user/client/create-client/CreateClientHandler';
import { CreateClientOutput } from 'application/usecases/user/client/create-client/CreateClientOutput';
import { DeleteClientHandler } from 'application/usecases/user/client/delete-client/DeleteClientHandler';
import { DeleteClientOutput } from 'application/usecases/user/client/delete-client/DeleteClientOutput';
import { FindClientHandler } from 'application/usecases/user/client/find-client/FindClientHandler';
import { FindClientOutput, FindClientData } from 'application/usecases/user/client/find-client/FindClientOutput';
import { GetClientHandler } from 'application/usecases/user/client/get-client/GetClientHandler';
import { GetClientData, GetClientOutput } from 'application/usecases/user/client/get-client/GetClientOutput';
import { GetProfileClientHandler } from 'application/usecases/user/client/get-profile-client/GetProfileClientHandler';
import { GetProfileClientData, GetProfileClientOutput } from 'application/usecases/user/client/get-profile-client/GetProfileClientOutput';
import { RegisterClientHandler } from 'application/usecases/user/client/register-client/RegisterClientHandler';
import { RegisterClientOutput } from 'application/usecases/user/client/register-client/RegisterClientOutput';
import { ResendActivationHandler } from 'application/usecases/user/client/resend-activation/ResendActivationHandler';
import { ResendActivationOutput } from 'application/usecases/user/client/resend-activation/ResendActivationOutput';
import { UpdateClientHandler } from 'application/usecases/user/client/update-client/UpdateClientHandler';
import { UpdateClientOutput } from 'application/usecases/user/client/update-client/UpdateClientOutput';
import { UpdateProfileClientHandler } from 'application/usecases/user/client/update-profile-client/UpdateProfileClientHandler';
import { UpdateProfileClientOutput } from 'application/usecases/user/client/update-profile-client/UpdateProfileClientOutput';
import axios from 'axios';
import { expect } from 'chai';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { mockUserAuthentication } from 'shared/test/MockAuthentication';
import { mockAuthJwtService } from 'shared/test/MockAuthJwtService';
import { mockInjection, mockUsecaseInjection } from 'shared/test/MockInjection';
import { mockWebApi } from 'shared/test/MockWebApi';
import { InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';

describe('Client controller', () => {
  const sandbox = createSandbox();
  let server: Server;
  const port = 6789;
  const endpoint = `http://localhost:${port}/api/v1/clients`;
  const options = { headers: { authorization: 'Bearer token' } };
  let findClientHandler: FindClientHandler;
  let getClientHandler: GetClientHandler;
  let getProfileClientHandler: GetProfileClientHandler;
  let registerClientHandler: RegisterClientHandler;
  let activeClientHandler: ActiveClientHandler;
  let resendActivationHandler: ResendActivationHandler;
  let createClientHandler: CreateClientHandler;
  let updateClientHandler: UpdateClientHandler;
  let updateProfileClientHandler: UpdateProfileClientHandler;
  let deleteClientHandler: DeleteClientHandler;
  let archiveClientHandler: ArchiveClientHandler;

  before((done) => {
    mockInjection(InjectService.AuthJwt, mockAuthJwtService());

    import('./ClientController').then((obj) => {
      server = mockWebApi(obj.ClientController, port, () => {
        findClientHandler = mockUsecaseInjection(FindClientHandler);
        getClientHandler = mockUsecaseInjection(GetClientHandler);
        getProfileClientHandler = mockUsecaseInjection(GetProfileClientHandler);
        registerClientHandler = mockUsecaseInjection(RegisterClientHandler);
        activeClientHandler = mockUsecaseInjection(ActiveClientHandler);
        resendActivationHandler = mockUsecaseInjection(ResendActivationHandler);
        createClientHandler = mockUsecaseInjection(CreateClientHandler);
        updateClientHandler = mockUsecaseInjection(UpdateClientHandler);
        updateProfileClientHandler = mockUsecaseInjection(UpdateProfileClientHandler);
        deleteClientHandler = mockUsecaseInjection(DeleteClientHandler);
        archiveClientHandler = mockUsecaseInjection(ArchiveClientHandler);

        done();
      });
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  after((done) => {
    Container.reset();
    server.close(done);
  });

  it('Find clients with unauthorized error', async () => {
    const { status, data } = await axios.get(endpoint).catch((error) => error.response);

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
    const { status, data } = await axios.get(endpoint + '/' + id).catch((error) => error.response);

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

  it('Get profile with unauthorized error', async () => {
    const { status, data } = await axios.get(endpoint + '/profile').catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Get profile by client', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Client });
    const d = new GetProfileClientData();
    d.id = randomUUID();
    const result = new GetProfileClientOutput();
    result.data = d;

    sandbox.stub(getProfileClientHandler, 'handle').resolves(result);
    const { status, data }: any = await axios.get(endpoint + '/profile', options);

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
      password: 'Nodecore@2',
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
      activeKey: randomBytes(32).toString('hex'),
    });

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Resend activation', async () => {
    const result = new ResendActivationOutput();
    result.data = true;
    sandbox.stub(resendActivationHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.post(endpoint + '/resend-activation', {
      email: 'client.test@localhost.com',
    });

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Create client with unauthorized error', async () => {
    const { status, data } = await axios
      .post(endpoint, {
        firstName: 'client',
        lastName: 'test',
        email: 'client.test@localhost.com',
        password: 'Nodecore@2',
      })
      .catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Create client by super admin', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
    const result = new CreateClientOutput();
    result.data = randomUUID();
    sandbox.stub(createClientHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.post(
      endpoint,
      {
        firstName: 'client',
        lastName: 'test',
        email: 'client.test@localhost.com',
        password: 'Nodecore@2',
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(result.data);
  });

  it('Update client with unauthorized error', async () => {
    const { status, data } = await axios
      .put(endpoint + '/' + randomUUID(), {
        firstName: 'client',
        lastName: 'test',
      })
      .catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Update client by super admin', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
    const result = new UpdateClientOutput();
    result.data = true;
    sandbox.stub(updateClientHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.put(
      endpoint + '/' + randomUUID(),
      {
        firstName: 'client',
        lastName: 'test',
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Update client profile with unauthorized error', async () => {
    const { status, data } = await axios
      .put(endpoint + '/profile', {
        firstName: 'client',
        lastName: 'test',
      })
      .catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Update client profile by client', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Client });
    const result = new UpdateProfileClientOutput();
    result.data = true;
    sandbox.stub(updateProfileClientHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.put(
      endpoint + '/profile',
      {
        firstName: 'client',
        lastName: 'test',
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Delete client with unauthorized error', async () => {
    const { status, data } = await axios.delete(endpoint + '/' + randomUUID()).catch((error) => error.response);

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
    const { status, data } = await axios.post(endpoint + '/' + randomUUID() + '/archive').catch((error) => error.response);

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
