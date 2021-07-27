import { DataResponse } from '@shared/usecase/DataResponse';
import { IsBoolean } from 'class-validator';

export class CheckEmailExistQueryOutput extends DataResponse<boolean> {
    @IsBoolean()
    data: boolean;

    setData(data: boolean): void {
        this.data = data;
    }
}
