/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Server } from 'http';
import path from 'path';
import { readFile } from '@libs/file';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { mockAuthentication } from '@shared/test/MockAuthentication';
import { mockApiService } from '@shared/test/MockWebApi';
import { UploadMyAvatarCommandHandler } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandHandler';
import { UploadMyAvatarCommandOutput } from '@usecases/user/user/commands/upload-my-avatar/UploadMyAvatarCommandOutput';
import axios from 'axios';
import { expect } from 'chai';
import FormData from 'form-data';
import multer from 'multer';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { v4 } from 'uuid';

describe('Me controller', () => {
    const sandbox = createSandbox();
    const sandbox2 = createSandbox();
    let server: Server;
    const port = 3000;
    const endpoint = `http://localhost:${port}/api/v1/me`;
    const options = { headers: { Authorization: 'Bearer token' } };
    let uploadMyAvatarCommandHandler: UploadMyAvatarCommandHandler;

    before(done => {
        sandbox2.stub(multer, 'diskStorage').returns(multer.memoryStorage());
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const MeController = require('./MeController').MeController;
        server = mockApiService(MeController, port, () => {
            Container.set(UploadMyAvatarCommandHandler, { handle() {} });
            uploadMyAvatarCommandHandler = Container.get(UploadMyAvatarCommandHandler);

            done();
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
        mockAuthentication({ userId: v4(), roleId: v4() } as any);
        const filePath = path.join(__dirname, '../../../../resources/images/test/workplace.jpg');
        const file = await readFile(filePath);
        const formData = new FormData();
        formData.append('avatar', file, 'avatar.jpg');

        const result = new UploadMyAvatarCommandOutput();
        result.setData('url');
        sandbox.stub(uploadMyAvatarCommandHandler, 'handle').resolves(result);

        let headers = JSON.parse(JSON.stringify(options.headers));
        headers = {
            ...headers,
            ...formData.getHeaders()
        };
        const { status, data } = await axios.post(endpoint + '/avatar', formData, { headers });

        expect(status).to.eq(200);
        expect(data.data).to.eq('url');
    });
});
