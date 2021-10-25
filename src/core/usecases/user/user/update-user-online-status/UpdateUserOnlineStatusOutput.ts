import { IsBoolean } from '@shared/decorators/ValidationDecorator';
import { DataResponse } from '@shared/usecase/DataResponse';

export class UpdateUserOnlineStatusOutput extends DataResponse<boolean> {
    @IsBoolean()
    data: boolean;
}
