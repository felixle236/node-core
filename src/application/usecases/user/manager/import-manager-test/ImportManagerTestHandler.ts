import path from 'path';
import { ILogService } from 'application/interfaces/services/ILogService';
import { STORAGE_UPLOAD_DIR } from 'config/Configuration';
import { InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { readFile, writeFile } from 'utils/File';
import { ImportManagerTestOutput } from './ImportManagerTestOutput';
import { UploadAvatarHandler } from '../../user/upload-avatar/UploadAvatarHandler';
import { UploadAvatarInput } from '../../user/upload-avatar/UploadAvatarInput';
import { CreateManagerHandler } from '../create-manager/CreateManagerHandler';
import { CreateManagerInput } from '../create-manager/CreateManagerInput';

@Service()
export class ImportManagerTestHandler implements IUsecaseHandler<undefined, ImportManagerTestOutput> {
    constructor(
        private readonly _createManagerHandler: CreateManagerHandler,
        private readonly _uploadAvatarHandler: UploadAvatarHandler,
        @Inject(InjectService.Log) private readonly _logService: ILogService
    ) {}

    async handle(): Promise<ImportManagerTestOutput> {
        const { managers } = await import('../../../../../resources/data/dummy-managers.js');
        for (const manager of managers) {
            const data = new CreateManagerInput();
            data.firstName = manager.firstName;
            data.lastName = manager.lastName;
            data.email = manager.email;
            data.password = manager.password;

            try {
                const result = await this._createManagerHandler.handle(data);
                if (manager.avatar) {
                    const buffer = await readFile(manager.avatar);
                    const filePath = path.join(STORAGE_UPLOAD_DIR, manager.avatar.substring(manager.avatar.lastIndexOf('/') + 1));
                    await writeFile(filePath, buffer);

                    const fileInput = new UploadAvatarInput();
                    fileInput.file = {
                        buffer,
                        path: filePath,
                        mimetype: 'image/' + filePath.substring(filePath.lastIndexOf('.') + 1),
                        size: buffer.length
                    } as Express.Multer.File;
                    await this._uploadAvatarHandler.handle(result.data, fileInput);
                }
            }
            catch (error) {
                this._logService.error('Import manager test', error);
            }
        }
        const result = new ImportManagerTestOutput();
        result.data = true;
        return result;
    }
}
