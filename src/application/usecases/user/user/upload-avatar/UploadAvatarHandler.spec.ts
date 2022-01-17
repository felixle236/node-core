import 'reflect-metadata';
import 'mocha';
import { randomUUID } from 'crypto';
import { User } from 'domain/entities/user/User';
import path from 'path';
import { IUserRepository } from 'application/interfaces/repositories/user/IUserRepository';
import { IStorageService } from 'application/interfaces/services/IStorageService';
import { expect } from 'chai';
import mime from 'mime-types';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { mockInjection, mockRepositoryInjection } from 'shared/test/MockInjection';
import { mockStorageService } from 'shared/test/MockStorageService';
import { InjectRepository, InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import * as fileLib from 'utils/File';
import { UploadAvatarHandler } from './UploadAvatarHandler';
import { UploadAvatarInput } from './UploadAvatarInput';

describe('User usecases - Upload avatar', () => {
  const sandbox = createSandbox();
  let userRepository: IUserRepository;
  let storageService: IStorageService;
  let uploadAvatarHandler: UploadAvatarHandler;
  let userTest: User;

  before(() => {
    storageService = mockInjection(InjectService.Storage, mockStorageService());
    userRepository = mockRepositoryInjection<IUserRepository>(InjectRepository.User);
    uploadAvatarHandler = new UploadAvatarHandler(storageService, userRepository);
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

  it('Upload avatar with data invalid error', async () => {
    const param = new UploadAvatarInput();
    param.file = {
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const error = await uploadAvatarHandler.handle(randomUUID(), param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_INVALID, { t: 'avatar' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Upload avatar with data not found error', async () => {
    sandbox.stub(User, 'validateAvatarFile').returns();
    sandbox.stub(userRepository, 'get').resolves();
    const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
    const buffer = await fileLib.readFile(filePath);

    const param = new UploadAvatarInput();
    param.file = {
      mimetype: mime.lookup('jpg'),
      size: buffer.length,
      buffer,
    } as Express.Multer.File;

    const error = await uploadAvatarHandler.handle(randomUUID(), param).catch((error) => error);
    const err = new NotFoundError();

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Upload avatar with upload failed error', async () => {
    sandbox.stub(User, 'validateAvatarFile').returns();
    sandbox.stub(userRepository, 'get').resolves(userTest);
    sandbox.stub(storageService, 'upload').resolves(false);
    sandbox.stub(fileLib, 'removeFile').resolves();
    const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
    const buffer = await fileLib.readFile(filePath);

    const param = new UploadAvatarInput();
    param.file = {
      mimetype: mime.lookup('jpg'),
      size: buffer.length,
      buffer,
    } as Express.Multer.File;

    const error = await uploadAvatarHandler.handle(randomUUID(), param).catch((error) => error);
    const err = new LogicalError(MessageError.PARAM_CANNOT_UPLOAD, { t: 'avatar' });

    expect(error.code).to.eq(err.code);
    expect(error.message).to.eq(err.message);
  });

  it('Upload avatar', async () => {
    sandbox.stub(User, 'validateAvatarFile').returns();
    sandbox.stub(userRepository, 'get').resolves(userTest);
    sandbox.stub(storageService, 'upload').resolves(true);
    sandbox.stub(fileLib, 'removeFile').resolves();
    sandbox.stub(userRepository, 'update').resolves(true);
    const filePath = path.join(__dirname, '../../../../../resources/images/test/workplace.jpg');
    const buffer = await fileLib.readFile(filePath);

    const id = randomUUID();
    const ext = mime.extension(mime.lookup('jpg') as string);
    const pathExpected = `users/${id}/images/avatar.${ext}`;

    const param = new UploadAvatarInput();
    param.file = {
      mimetype: mime.lookup('jpg'),
      size: buffer.length,
      buffer,
    } as Express.Multer.File;

    const result = await uploadAvatarHandler.handle(id, param);
    expect(result.data).to.eq(pathExpected);
  });
});
