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
import { ImportManagerTestHandler } from './ImportManagerTestHandler';
import { UploadAvatarHandler } from '../../user/upload-avatar/UploadAvatarHandler';
import { CreateManagerHandler } from '../create-manager/CreateManagerHandler';

describe('Manager usecases - Import manager test', () => {
    const sandbox = createSandbox();
    let createManagerHandler: CreateManagerHandler;
    let uploadAvatarHandler: UploadAvatarHandler;
    let importManagerTestHandler: ImportManagerTestHandler;
    let logService: ILogService;

    before(async () => {
        createManagerHandler = mockUsecaseInjection(CreateManagerHandler);
        uploadAvatarHandler = mockUsecaseInjection(UploadAvatarHandler);
        logService = mockInjection<ILogService>(InjectService.Log, mockLogService());
        importManagerTestHandler = new ImportManagerTestHandler(createManagerHandler, uploadAvatarHandler, logService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Container.reset();
    });

    it('Import manager test', async () => {
        sandbox.stub(createManagerHandler, 'handle').resolves({ data: 'id' });
        sandbox.stub(file, 'writeFile').resolves();
        sandbox.stub(uploadAvatarHandler, 'handle').resolves();

        const result = await importManagerTestHandler.handle();
        expect(result.data).to.eq(true);
    });

    it('Import manager test with data exists', async () => {
        sandbox.stub(createManagerHandler, 'handle').throws(new LogicalError(MessageError.PARAM_EXISTED, { t: 'email' }));
        const result = await importManagerTestHandler.handle();
        expect(result.data).to.eq(true);
    });
});
