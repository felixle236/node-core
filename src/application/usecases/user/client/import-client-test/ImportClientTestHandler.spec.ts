import 'reflect-metadata';
import 'mocha';
import { ILogService } from 'application/interfaces/services/ILogService';
import { expect } from 'chai';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { mockUsecaseInjection, mockInjection } from 'shared/test/MockInjection';
import { mockLogService } from 'shared/test/MockLogService';
import { InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import * as file from 'utils/File';
import { ImportClientTestHandler } from './ImportClientTestHandler';
import { UploadMyAvatarHandler } from '../../user/upload-my-avatar/UploadMyAvatarHandler';
import { CreateClientHandler } from '../create-client/CreateClientHandler';

describe('Client usecases - Import client test', () => {
    const sandbox = createSandbox();
    let createClientHandler: CreateClientHandler;
    let uploadMyAvatarHandler: UploadMyAvatarHandler;
    let importClientTestHandler: ImportClientTestHandler;
    let logService: ILogService;

    before(async () => {
        createClientHandler = mockUsecaseInjection(CreateClientHandler);
        uploadMyAvatarHandler = mockUsecaseInjection(UploadMyAvatarHandler);
        logService = mockInjection<ILogService>(InjectService.Log, mockLogService());
        importClientTestHandler = new ImportClientTestHandler(createClientHandler, uploadMyAvatarHandler, logService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Import client test', async () => {
        sandbox.stub(createClientHandler, 'handle').resolves({ data: 'id' });
        sandbox.stub(file, 'writeFile').resolves();
        sandbox.stub(uploadMyAvatarHandler, 'handle').resolves();

        const result = await importClientTestHandler.handle();
        expect(result.data).to.eq(true);
    });

    it('Import client test with data exists', async () => {
        sandbox.stub(createClientHandler, 'handle').throws(new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' }));
        const result = await importClientTestHandler.handle();
        expect(result.data).to.eq(true);
    });
});
