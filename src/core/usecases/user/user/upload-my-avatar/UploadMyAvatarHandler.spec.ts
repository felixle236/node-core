/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import path from 'path';
import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { IStorageService } from '@gateways/services/IStorageService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockStorageService } from '@shared/test/MockStorageService';
import * as fileLib from '@utils/file';
import { expect } from 'chai';
import mime from 'mime-types';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { UploadMyAvatarHandler } from './UploadMyAvatarHandler';
import { UploadMyAvatarInput } from './UploadMyAvatarInput';

describe('User usecases - Upload my avatar', () => {
    const sandbox = createSandbox();
    let userRepository: IUserRepository;
    let storageService: IStorageService;
    let uploadMyAvatarHandler: UploadMyAvatarHandler;
    let userTest: User;

    before(() => {
        Container.set('user.repository', {
            get() {},
            update() {}
        });
        Container.set('storage.service', mockStorageService());

        userRepository = Container.get<IUserRepository>('user.repository');
        storageService = Container.get<IStorageService>('storage.service');
        uploadMyAvatarHandler = Container.get(UploadMyAvatarHandler);
    });

    beforeEach(() => {
        userTest = new User();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Upload my avatar with data invalid error', async () => {
        const param = new UploadMyAvatarInput();
        param.file = {
            buffer: Buffer.from('test')
        } as Express.Multer.File;

        const error = await uploadMyAvatarHandler.handle(randomUUID(), param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_INVALID, { t: 'avatar' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Upload my avatar with data not found error', async () => {
        sandbox.stub(User, 'validateAvatarFile').returns();
        sandbox.stub(userRepository, 'get').resolves(null);
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
        const buffer = await fileLib.readFile(filePath);

        const param = new UploadMyAvatarInput();
        param.file = {
            mimetype: mime.lookup('jpg'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const error = await uploadMyAvatarHandler.handle(randomUUID(), param).catch(error => error);
        const err = new SystemError(MessageError.DATA_NOT_FOUND);

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Upload my avatar with upload failed error', async () => {
        sandbox.stub(User, 'validateAvatarFile').returns();
        sandbox.stub(userRepository, 'get').resolves(userTest);
        sandbox.stub(storageService, 'upload').resolves(false);
        sandbox.stub(fileLib, 'removeFile').resolves();
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
        const buffer = await fileLib.readFile(filePath);

        const param = new UploadMyAvatarInput();
        param.file = {
            mimetype: mime.lookup('jpg'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const error = await uploadMyAvatarHandler.handle(randomUUID(), param).catch(error => error);
        const err = new SystemError(MessageError.PARAM_CANNOT_UPLOAD, { t: 'avatar' });

        expect(error.code).to.eq(err.code);
        expect(error.message).to.eq(err.message);
    });

    it('Upload my avatar', async () => {
        sandbox.stub(User, 'validateAvatarFile').returns();
        sandbox.stub(userRepository, 'get').resolves(userTest);
        sandbox.stub(storageService, 'upload').resolves(true);
        sandbox.stub(fileLib, 'removeFile').resolves();
        sandbox.stub(userRepository, 'update').resolves(true);
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
        const buffer = await fileLib.readFile(filePath);

        const id = randomUUID();
        const ext = mime.extension(mime.lookup('jpg') as string);
        const pathExpected = User.getAvatarPath(id, ext as string);

        const param = new UploadMyAvatarInput();
        param.file = {
            mimetype: mime.lookup('jpg'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const result = await uploadMyAvatarHandler.handle(id, param);
        expect(result.data).to.eq(pathExpected);
    });
});
