import { RefSchemaArray } from 'shared/decorators/RefSchema';
import { IsArray, IsBoolean, IsDateString, IsOptional, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetListOnlineStatusByIdsData {
  @IsUUID()
  id: string;

  @IsBoolean()
  isOnline: boolean;

  @IsDateString()
  @IsOptional()
  onlineAt?: Date;
}

export class GetListOnlineStatusByIdsOutput extends DataResponse<GetListOnlineStatusByIdsData[]> {
  @IsArray()
  @RefSchemaArray(GetListOnlineStatusByIdsData)
  data: GetListOnlineStatusByIdsData[];
}
