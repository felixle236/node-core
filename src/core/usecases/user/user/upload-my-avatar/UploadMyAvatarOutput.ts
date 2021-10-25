import { IsString } from '@shared/decorators/ValidationDecorator';
import { DataResponse } from '@shared/usecase/DataResponse';

export class UploadMyAvatarOutput extends DataResponse<string> {
    @IsString()
    data: string;
}
