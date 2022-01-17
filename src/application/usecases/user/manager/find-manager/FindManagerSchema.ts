import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RefSchemaArray } from 'shared/decorators/RefSchema';
import { IsEnum, IsOptional, IsString, IsArray, IsDateString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { PaginationRequest } from 'shared/usecase/PaginationRequest';
import { PaginationResponse } from 'shared/usecase/PaginationResponse';

export class FindManagerInput extends PaginationRequest {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsEnum(ManagerStatus)
  @IsOptional()
  status?: ManagerStatus;
}

export class FindManagerDataOutput {
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

export class FindManagerOutput extends PaginationResponse<FindManagerDataOutput> {
  @IsArray()
  @RefSchemaArray(FindManagerDataOutput)
  data: FindManagerDataOutput[];
}
