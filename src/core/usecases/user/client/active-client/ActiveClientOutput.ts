import { IsBoolean } from '@shared/decorators/ValidationDecorator';
import { DataResponse } from '@shared/usecase/DataResponse';

export class ActiveClientOutput extends DataResponse<boolean> {
    @IsBoolean()
    data: boolean;
}
