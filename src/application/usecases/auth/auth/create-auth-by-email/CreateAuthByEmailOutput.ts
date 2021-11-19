import { IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class CreateAuthByEmailOutput extends DataResponse<string> {
    @IsUUID()
    data: string;
}
