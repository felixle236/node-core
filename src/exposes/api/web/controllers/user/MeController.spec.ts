import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { Server } from 'http';
import path from 'path';
import { UploadMyAvatarHandler } from 'application/usecases/user/user/upload-my-avatar/UploadMyAvatarHandler';
import { UploadMyAvatarOutput } from 'application/usecases/user/user/upload-my-avatar/UploadMyAvatarOutput';
import axios from 'axios';
import { expect } from 'chai';
import FormData from 'form-data';
import multer from 'multer';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { mockUserAuthentication } from 'shared/test/MockAuthentication';
import { mockAuthJwtService } from 'shared/test/MockAuthJwtService';
import { mockInjection, mockUsecaseInjection } from 'shared/test/MockInjection';
import { mockWebApi } from 'shared/test/MockWebApi';
import { InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { readFile } from 'utils/File';

describe('Me controller', () => {
    const sandbox = createSandbox();
    const sandbox2 = createSandbox();
    let server: Server;
    const port = 6789;
    const endpoint = `http://localhost:${port}/api/v1/me`;
    const options = { headers: { authorization: 'Bearer token' } };
    let uploadMyAvatarHandler: UploadMyAvatarHandler;

    before(done => {
        mockInjection(InjectService.AuthJwt, mockAuthJwtService());
        sandbox2.stub(multer, 'diskStorage').returns(multer.memoryStorage());

        import('./MeController').then(obj => {
            server = mockWebApi(obj.MeController, port, () => {
                uploadMyAvatarHandler = mockUsecaseInjection(UploadMyAvatarHandler);

                done();
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        Container.reset();
        sandbox2.restore();
        server.close(done);
    });

    it('Upload my avatar with unauthorized error', async () => {
        const { status, data } = await axios.post(endpoint + '/avatar').catch(error => error.response);

        expect(status).to.eq(401);
        expect(data.code).to.eq(new UnauthorizedError().code);
    });

    it('Upload my avatar', async () => {
        mockUserAuthentication(sandbox, { userId: randomUUID(), roleId: randomUUID() });
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
        const file = await readFile(filePath);
        const formData = new FormData();
        formData.append('avatar', file, 'avatar.jpg');

        const result = new UploadMyAvatarOutput();
        result.data = 'url';
        sandbox.stub(uploadMyAvatarHandler, 'handle').resolves(result);

        let headers = JSON.parse(JSON.stringify(options.headers));
        headers = {
            ...headers,
            ...formData.getHeaders()
        };
        const { status, data }: any = await axios.post(endpoint + '/avatar', formData, { headers });

        expect(status).to.eq(200);
        expect(data.data).to.eq('url');
    });
});
