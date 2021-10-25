import { IsBoolean } from '@shared/decorators/ValidationDecorator';
import { DataResponse } from '@shared/usecase/DataResponse';

export class ArchiveManagerOutput extends DataResponse<boolean> {
    @IsBoolean()
    data: boolean;
}
