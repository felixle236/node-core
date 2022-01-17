import { RefSchemaArray } from 'shared/decorators/RefSchema';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsOptional, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetListOnlineStatusByIdsInput {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  ids: string[];
}

export class GetListOnlineStatusByIdsDataOutput {
  @IsUUID()
  id: string;

  @IsBoolean()
  isOnline: boolean;

  @IsDateString()
  @IsOptional()
  onlineAt?: Date;
}

export class GetListOnlineStatusByIdsOutput extends DataResponse<GetListOnlineStatusByIdsDataOutput[]> {
  @IsArray()
  @RefSchemaArray(GetListOnlineStatusByIdsDataOutput)
  data: GetListOnlineStatusByIdsDataOutput[];
}
