import { RefSchemaArray } from 'shared/decorators/RefSchema';
import { IsArray, IsDateString, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { PaginationResponse } from 'shared/usecase/PaginationResponse';

export class FindManagerData {
  @IsUUID()
  id: string;

  @IsDateString()
  createdAt: Date;

  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class FindManagerOutput extends PaginationResponse<FindManagerData> {
  @IsArray()
  @RefSchemaArray(FindManagerData)
  data: FindManagerData[];
}
