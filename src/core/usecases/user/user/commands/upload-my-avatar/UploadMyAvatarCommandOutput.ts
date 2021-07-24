import { DataResponse } from '@shared/usecase/DataResponse';
import { IsString } from 'class-validator';

export class UploadMyAvatarCommandOutput extends DataResponse<string> {
    @IsString()
    data: string;

    setData(data: string): void {
        this.data = data;
    }
}
