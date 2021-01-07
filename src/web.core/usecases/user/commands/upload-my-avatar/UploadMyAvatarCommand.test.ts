import 'reflect-metadata';
import 'mocha';
import * as path from 'path';
import { expect } from 'chai';
import * as mime from 'mime-types';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import * as uuid from 'uuid';
import { UploadMyAvatarCommand } from './UploadMyAvatarCommand';
import { UploadMyAvatarCommandHandler } from './UploadMyAvatarCommandHandler';
import { STORAGE_URL } from '../../../../../configs/Configuration';
import { readFile } from '../../../../../libs/file';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { IUser } from '../../../../domain/types/user/IUser';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { IStorageService } from '../../../../gateways/services/IStorageService';

Container.set('user.repository', {
    async update() {}
});
Container.set('storage.service', {
    async upload() {}
});
const userRepository = Container.get<IUserRepository>('user.repository');
const storageService = Container.get<IStorageService>('storage.service');
const uploadMyAvatarCommandHandler = Container.get(UploadMyAvatarCommandHandler);

const generateUser = () => {
    return new User({ id: uuid.v4(), createdAt: new Date(), roleId: uuid.v4(), firstName: 'User', lastName: '1', email: 'user1@localhost.com' } as IUser);
};

describe('User - Update my avatar', () => {
    const sandbox = createSandbox();
    let user: User;

    beforeEach(() => {
        user = generateUser();
        user.password = 'Nodecore@123';
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Update my avatar without permission', async () => {
        const param = new UploadMyAvatarCommand();

        const result = await uploadMyAvatarCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'permission'));
    });

    it('Update my avatar without avatar file', async () => {
        const param = new UploadMyAvatarCommand();
        param.userAuthId = user.id;

        const result = await uploadMyAvatarCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_REQUIRED, 'avatar file'));
    });

    it('Update my avatar with avatar extension is invalid', async () => {
        const param = new UploadMyAvatarCommand();
        param.userAuthId = user.id;
        param.file = {
            buffer: Buffer.from('test')
        } as Express.Multer.File;

        const result = await uploadMyAvatarCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_INVALID, 'avatar file'));
    });

    it('Update my avatar with the format of file is not supported', async () => {
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.tiff');
        const buffer = await readFile(filePath);

        const param = new UploadMyAvatarCommand();
        param.userAuthId = user.id;
        param.file = {
            mimetype: mime.lookup('tiff'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const result = await uploadMyAvatarCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_FORMAT_INVALID, 'avatar file', 'jpeg, jpg, png, gif'));
    });

    it('Update my avatar with large size', async () => {
        const filePath = path.join(__dirname, '../../../../../resources/images/test/test-large-size.png');
        const buffer = await readFile(filePath);

        const param = new UploadMyAvatarCommand();
        param.userAuthId = user.id;
        param.file = {
            mimetype: mime.lookup('png'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const result = await uploadMyAvatarCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_SIZE_MAX, 'avatar file', 100, 'KB'));
    });

    it('Update my avatar with the length of avatar path greater than 100 characters', async () => {
        sandbox.stub(User, 'getAvatarPath').returns('images/users/25235634634636363636346363345636734562-25235634634636363636346363345636734562/avatar.png');
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
        const buffer = await readFile(filePath);

        const param = new UploadMyAvatarCommand();
        param.userAuthId = user.id;
        param.file = {
            mimetype: mime.lookup('jpg'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const result = await uploadMyAvatarCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_LEN_MAX, 'avatar path', 100));
    });

    it('Update my avatar with avatar file cannot upload', async () => {
        sandbox.stub(storageService, 'upload').resolves(false);
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
        const buffer = await readFile(filePath);

        const param = new UploadMyAvatarCommand();
        param.userAuthId = user.id;
        param.file = {
            mimetype: mime.lookup('jpg'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const result = await uploadMyAvatarCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.PARAM_CANNOT_UPLOAD, 'avatar file'));
    });

    it('Update my avatar with data cannot save', async () => {
        sandbox.stub(storageService, 'upload').resolves(true);
        sandbox.stub(userRepository, 'update').resolves(false);
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
        const buffer = await readFile(filePath);

        const param = new UploadMyAvatarCommand();
        param.userAuthId = user.id;
        param.file = {
            mimetype: mime.lookup('jpg'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const result = await uploadMyAvatarCommandHandler.handle(param).catch(error => error);
        expect(result).to.include(new SystemError(MessageError.DATA_CANNOT_SAVE, 'avatar file'));
    });

    it('Update my avatar successfully', async () => {
        const avatarPath = `images/users/${user.id}/avatar.jpg`;
        sandbox.stub(User, 'getAvatarPath').returns(avatarPath);
        sandbox.stub(storageService, 'upload').resolves(true);
        sandbox.stub(userRepository, 'update').resolves(true);
        const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
        const buffer = await readFile(filePath);

        const param = new UploadMyAvatarCommand();
        param.userAuthId = user.id;
        param.file = {
            mimetype: mime.lookup('jpg'),
            size: buffer.length,
            buffer
        } as Express.Multer.File;

        const url = await uploadMyAvatarCommandHandler.handle(param);
        expect(url).to.eq(STORAGE_URL + avatarPath);
    });
});
