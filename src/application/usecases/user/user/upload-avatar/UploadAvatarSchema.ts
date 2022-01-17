import { IsNotEmptyObject, IsString } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class UploadAvatarInput {
  @IsNotEmptyObject()
  file: Express.Multer.File;
}

export class UploadAvatarOutput extends DataResponse<string> {
  @IsString()
  data: string;
}
