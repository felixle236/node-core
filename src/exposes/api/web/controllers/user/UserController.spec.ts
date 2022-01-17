import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { RoleId } from 'domain/enums/user/RoleId';
import { Server } from 'http';
import path from 'path';
import { ImportClientTestHandler } from 'application/usecases/user/client/import-client-test/ImportClientTestHandler';
import { ImportManagerTestHandler } from 'application/usecases/user/manager/import-manager-test/ImportManagerTestHandler';
import { GetListOnlineStatusByIdsHandler } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsHandler';
import {
  GetListOnlineStatusByIdsData,
  GetListOnlineStatusByIdsOutput,
} from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsOutput';
import { UploadAvatarHandler } from 'application/usecases/user/user/upload-avatar/UploadAvatarHandler';
import { UploadAvatarOutput } from 'application/usecases/user/user/upload-avatar/UploadAvatarOutput';
import axios from 'axios';
import { expect } from 'chai';
import { WEB_API_PRIVATE_KEY } from 'config/Configuration';
import FormData from 'form-data';
import multer from 'multer';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { InputValidationError } from 'shared/exceptions/InputValidationError';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { mockUserAuthentication } from 'shared/test/MockAuthentication';
import { mockAuthJwtService } from 'shared/test/MockAuthJwtService';
import { mockInjection, mockUsecaseInjection } from 'shared/test/MockInjection';
import { mockWebApi } from 'shared/test/MockWebApi';
import { HttpHeaderKey } from 'shared/types/Common';
import { InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { readFile } from 'utils/File';

describe('User controller', () => {
  const sandbox = createSandbox();
  let server: Server;
  const port = 6789;
  const endpoint = `http://localhost:${port}/api/v1/users`;
  const options = { headers: { authorization: 'Bearer token' } };
  let uploadAvatarHandler: UploadAvatarHandler;
  let getListOnlineStatusByIdsHandler: GetListOnlineStatusByIdsHandler;
  let importManagerTestHandler: ImportManagerTestHandler;
  let importClientTestHandler: ImportClientTestHandler;

  before((done) => {
    mockInjection(InjectService.AuthJwt, mockAuthJwtService());
    sandbox.stub(multer, 'diskStorage').returns(multer.memoryStorage());

    import('./UserController').then((obj) => {
      server = mockWebApi(obj.UserController, port, () => {
        uploadAvatarHandler = mockUsecaseInjection(UploadAvatarHandler);
        getListOnlineStatusByIdsHandler = mockUsecaseInjection(GetListOnlineStatusByIdsHandler);
        importManagerTestHandler = mockUsecaseInjection(ImportManagerTestHandler);
        importClientTestHandler = mockUsecaseInjection(ImportClientTestHandler);

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

  it('Upload avatar with unauthorized error', async () => {
    const { status, data } = await axios.post(endpoint + '/avatar').catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Upload avatar', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });
    const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
    const file = await readFile(filePath);
    const formData = new FormData();
    formData.append('avatar', file, 'avatar.jpg');

    const result = new UploadAvatarOutput();
    result.data = 'url';
    sandbox.stub(uploadAvatarHandler, 'handle').resolves(result);

    let headers = JSON.parse(JSON.stringify(options.headers));
    headers = {
      ...headers,
      ...formData.getHeaders(),
    };
    const { status, data } = await axios.post(endpoint + '/avatar', formData, { headers });

    expect(status).to.eq(200);
    expect(data.data).to.eq('url');
  });

  it('Get list online status with unauthorized error', async () => {
    const { status, data } = await axios.get(endpoint + '/list-online-status').catch((error) => error.response);

    expect(status).to.eq(401);
    expect(data.code).to.eq(new UnauthorizedError().code);
  });

  it('Get list online status with no param', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });
    const { status, data } = await axios.get(endpoint + '/list-online-status', options).catch((error) => error.response);

    expect(status).to.eq(400);
    expect(data.code).to.eq(new InputValidationError().code);
  });

  it('Get list online status with more than 100 params', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });

    let params = '';
    for (let i = 0; i < 101; i++) {
      params += `ids[]=${randomUUID()}&`;
    }

    const { status, data } = await axios.get(endpoint + '/list-online-status?' + params, options).catch((error) => error.response);

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

    const { status, data } = await axios.get(endpoint + `/list-online-status?ids[]=${randomUUID()}&ids[]=${randomUUID()}`, options);

    expect(status).to.eq(200);
    expect(data.data).to.not.eq(undefined);
  });

  it('Access API private demo with access denied error', async () => {
    const options = { headers: { [HttpHeaderKey.PrivateKey]: '123' } };
    const { status, data } = await axios.get(endpoint + '/api-private-demo', options).catch((error) => error.response);

    expect(status).to.eq(403);
    expect(data.code).to.eq(new AccessDeniedError().code);
  });

  it('Access API private demo successful', async () => {
    const options = { headers: { [HttpHeaderKey.PrivateKey]: WEB_API_PRIVATE_KEY } };
    const { status, data } = await axios.get(endpoint + '/api-private-demo', options);

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Post list object demo with error', async () => {
    const { status, data } = await axios
      .post(
        endpoint + '/list-object-demo',
        {
          list: [
            {
              content: '123456',
              order: 1,
            },
            {
              content: '1234567',
              order: -1,
            },
          ],
        },
        options,
      )
      .catch((error) => error.response);

    expect(status).to.eq(400);
    expect(data.code).to.eq('VALIDATION_ERR');
    expect(
      data.fields.length === 2 &&
        data.fields[0].index === 1 &&
        data.fields[1].index === 1 &&
        data.fields[0].name === 'content' &&
        data.fields[1].name === 'order',
    ).to.eq(true);
  });

  it('Post list object demo successful', async () => {
    const { status, data } = await axios.post(
      endpoint + '/list-object-demo',
      {
        list: [
          {
            content: '123456',
            order: 1,
          },
          {
            content: 'abc123',
            order: 2,
          },
        ],
      },
      options,
    );

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });

  it('Import user test', async () => {
    mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: RoleId.SuperAdmin });
    sandbox.stub(importManagerTestHandler, 'handle').resolves({ data: true });
    sandbox.stub(importClientTestHandler, 'handle').resolves({ data: true });
    const { status, data } = await axios.post(endpoint + '/import-user-test', options);

    expect(status).to.eq(200);
    expect(data.data).to.eq(true);
  });
});
