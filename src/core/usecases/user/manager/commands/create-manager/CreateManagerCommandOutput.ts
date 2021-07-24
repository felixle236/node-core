import { DataResponse } from '@shared/usecase/DataResponse';
import { IsUUID } from 'class-validator';

export class CreateManagerCommandOutput extends DataResponse<string> {
    @IsUUID()
    data: string;

    setData(data: string): void {
        this.data = data;
    }
}
