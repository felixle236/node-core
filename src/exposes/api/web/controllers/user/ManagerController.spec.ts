import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { RoleId } from 'domain/enums/user/RoleId';
import { Server } from 'http';
import { ArchiveManagerHandler } from 'application/usecases/user/manager/archive-manager/ArchiveManagerHandler';
import { ArchiveManagerOutput } from 'application/usecases/user/manager/archive-manager/ArchiveManagerOutput';
import { CreateManagerHandler } from 'application/usecases/user/manager/create-manager/CreateManagerHandler';
import { CreateManagerOutput } from 'application/usecases/user/manager/create-manager/CreateManagerOutput';
import { DeleteManagerHandler } from 'application/usecases/user/manager/delete-manager/DeleteManagerHandler';
import { DeleteManagerOutput } from 'application/usecases/user/manager/delete-manager/DeleteManagerOutput';
import { FindManagerHandler } from 'application/usecases/user/manager/find-manager/FindManagerHandler';
import { FindManagerData, FindManagerOutput } from 'application/usecases/user/manager/find-manager/FindManagerOutput';
import { GetManagerHandler } from 'application/usecases/user/manager/get-manager/GetManagerHandler';
import { GetManagerData, GetManagerOutput } from 'application/usecases/user/manager/get-manager/GetManagerOutput';
import { GetProfileManagerHandler } from 'application/usecases/user/manager/get-profile-manager/GetProfileManagerHandler';
import {
  GetProfileManagerData,
  GetProfileManagerOutput,
} from 'application/usecases/user/manager/get-profile-manager/GetProfileManagerOutput';
import { UpdateManagerHandler } from 'application/usecases/user/manager/update-manager/UpdateManagerHandler';
import { UpdateManagerOutput } from 'application/usecases/user/manager/update-manager/UpdateManagerOutput';
import { UpdateProfileManagerHandler } from 'application/usecases/user/manager/update-profile-manager/UpdateProfileManagerHandler';
import { UpdateProfileManagerOutput } from 'application/usecases/user/manager/update-profile-manager/UpdateProfileManagerOutput';
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

describe('Manager controller', () => {
  const sandbox = createSandbox();
  let server: Server;
  const port = 6789;
  const endpoint = `http://localhost:${port}/api/v1/managers`;
  const options = { headers: { authorization: 'Bearer token' } };
  let findManagerHandler: FindManagerHandler;
  let getManagerHandler: GetManagerHandler;
  let getProfileManagerHandler: GetProfileManagerHandler;
  let createManagerHandler: CreateManagerHandler;
  let updateManagerHandler: UpdateManagerHandler;
  let updateProfileManagerHandler: UpdateProfileManagerHandler;
  let deleteManagerHandler: DeleteManagerHandler;
  let archiveManagerHandler: ArchiveManagerHandler;

  before((done) => {
    mockInjection(InjectService.AuthJwt, mockAuthJwtService());

    import('./ManagerController').then((obj) => {
      server = mockWebApi(obj.ManagerController, port, () => {
        findManagerHandler = mockUsecaseInjection(FindManagerHandler);
        getManagerHandler = mockUsecaseInjection(GetManagerHandler);
        getProfileManagerHandler = mockUsecaseInjection(GetProfileManagerHandler);
        createManagerHandler = mockUsecaseInjection(CreateManagerHandler);
        updateManagerHandler = mockUsecaseInjection(UpdateManagerHandler);
        updateProfileManagerHandler = mockUsecaseInjection(UpdateProfileManagerHandler);
        deleteManagerHandler = mockUsecaseInjection(DeleteManagerHandler);
        archiveManagerHandler = mockUsecaseInjection(ArchiveManagerHandler);

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

  it('Find managers with unauthorized error', async () => {
    const { status, data } = await axios.get(endpoint).catch((error) => error.response);

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
    const { status, data } = await axios.get(endpoint + '/' + id).catch((error) => error.response);

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

  it('Get profile with unauthorized error', async () => {
    const { status, data } = await axios.get(endpoint + '/profile').catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Get profile by super admin', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
    const d = new GetProfileManagerData();
    d.id = randomUUID();
    const result = new GetProfileManagerOutput();
    result.data = d;

    sandbox.stub(getProfileManagerHandler, 'handle').resolves(result);
    const { status, data }: any = await axios.get(endpoint + '/profile', options);

    expect(status).to.eq(200);
    expect(data.data.id).to.eq(d.id);
  });

  it('Get profile by manager', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Manager });
    const d = new GetProfileManagerData();
    d.id = randomUUID();
    const result = new GetProfileManagerOutput();
    result.data = d;

    sandbox.stub(getProfileManagerHandler, 'handle').resolves(result);
    const { status, data }: any = await axios.get(endpoint + '/profile', options);

    expect(status).to.eq(200);
    expect(data.data.id).to.eq(d.id);
  });

  it('Create manager with unauthorized error', async () => {
    const { status, data } = await axios
      .post(endpoint, {
        firstName: 'manager',
        lastName: 'test',
        email: 'manager.test@localhost.com',
        password: 'Nodecore@2',
      })
      .catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Create manager by super admin', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
    const result = new CreateManagerOutput();
    result.data = randomUUID();
    sandbox.stub(createManagerHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.post(
      endpoint,
      {
        firstName: 'manager',
        lastName: 'test',
        email: 'manager.test@localhost.com',
        password: 'Nodecore@2',
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(result.data);
  });

  it('Update manager with unauthorized error', async () => {
    const { status, data } = await axios
      .put(endpoint + '/' + randomUUID(), {
        firstName: 'manager',
        lastName: 'test',
      })
      .catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Update manager by super admin', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
    const result = new UpdateManagerOutput();
    result.data = true;
    sandbox.stub(updateManagerHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.put(
      endpoint + '/' + randomUUID(),
      {
        firstName: 'manager',
        lastName: 'test',
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Update manager profile with unauthorized error', async () => {
    const { status, data } = await axios
      .put(endpoint + '/profile', {
        firstName: 'manager',
        lastName: 'test',
      })
      .catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Update manager profile by super admin', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
    const result = new UpdateProfileManagerOutput();
    result.data = true;
    sandbox.stub(updateProfileManagerHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.put(
      endpoint + '/profile',
      {
        firstName: 'manager',
        lastName: 'test',
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Update manager profile by manager', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.Manager });
    const result = new UpdateProfileManagerOutput();
    result.data = true;
    sandbox.stub(updateProfileManagerHandler, 'handle').resolves(result);

    const { status, data }: any = await axios.put(
      endpoint + '/profile',
      {
        firstName: 'manager',
        lastName: 'test',
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Delete manager with unauthorized error', async () => {
    const { status, data } = await axios.delete(endpoint + '/' + randomUUID()).catch((error) => error.response);

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
    const { status, data } = await axios.post(endpoint + '/' + randomUUID() + '/archive').catch((error) => error.response);

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
