import { IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class ImportManagerTestOutput extends DataResponse<boolean> {
    @IsBoolean()
    data: boolean;
}
