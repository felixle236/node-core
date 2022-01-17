import path from 'path';
import { ILogService } from 'application/interfaces/services/ILogService';
import { STORAGE_UPLOAD_DIR } from 'config/Configuration';
import { InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { readFile, writeFile } from 'utils/File';
import { ImportClientTestOutput } from './ImportClientTestOutput';
import { UploadAvatarHandler } from '../../user/upload-avatar/UploadAvatarHandler';
import { UploadAvatarInput } from '../../user/upload-avatar/UploadAvatarInput';
import { CreateClientHandler } from '../create-client/CreateClientHandler';
import { CreateClientInput } from '../create-client/CreateClientInput';

@Service()
export class ImportClientTestHandler implements IUsecaseHandler<undefined, ImportClientTestOutput> {
  constructor(
    private readonly _createClientHandler: CreateClientHandler,
    private readonly _uploadAvatarHandler: UploadAvatarHandler,
    @Inject(InjectService.Log) private readonly _logService: ILogService,
  ) {}

  async handle(): Promise<ImportClientTestOutput> {
    const { clients } = await import('../../../../../resources/data/dummy-clients.js');
    for (const client of clients) {
      const data = new CreateClientInput();
      data.firstName = client.firstName;
      data.lastName = client.lastName;
      data.email = client.email;
      data.gender = client.gender;
      data.password = client.password;

      try {
        const result = await this._createClientHandler.handle(data);
        if (client.avatar) {
          const buffer = await readFile(client.avatar);
          const filePath = path.join(STORAGE_UPLOAD_DIR, client.avatar.substring(client.avatar.lastIndexOf('/') + 1));
          await writeFile(filePath, buffer);

          const fileInput = new UploadAvatarInput();
          fileInput.file = {
            buffer,
            path: filePath,
            mimetype: 'image/' + filePath.substring(filePath.lastIndexOf('.') + 1),
            size: buffer.length,
          } as Express.Multer.File;
          await this._uploadAvatarHandler.handle(result.data, fileInput);
        }
      } catch (error) {
        this._logService.error('Import client test', error);
      }
    }
    const result = new ImportClientTestOutput();
    result.data = true;
    return result;
  }
}
