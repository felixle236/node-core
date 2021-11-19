import { IsJWT } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class LoginByEmailOutput extends DataResponse<string> {
    @IsJWT()
    data: string;
}
