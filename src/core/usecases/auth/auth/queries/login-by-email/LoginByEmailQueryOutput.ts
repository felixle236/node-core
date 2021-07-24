import { DataResponse } from '@shared/usecase/DataResponse';
import { IsJWT } from 'class-validator';

export class LoginByEmailQueryOutput extends DataResponse<string> {
    @IsJWT()
    data: string;

    setData(data: string): void {
        this.data = data;
    }
}
