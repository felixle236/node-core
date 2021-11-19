import { IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class DeleteClientOutput extends DataResponse<boolean> {
    @IsBoolean()
    data: boolean;
}
