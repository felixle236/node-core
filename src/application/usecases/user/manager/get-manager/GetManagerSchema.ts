import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetManagerDataOutput {
  @IsUUID()
  id: string;

  @IsDateString()
  createdAt: Date;

  @IsEnum(ManagerStatus)
  status: ManagerStatus;

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

  @IsDateString()
  @IsOptional()
  archivedAt?: Date;
}

export class GetManagerOutput extends DataResponse<GetManagerDataOutput> {
  @IsObject()
  @RefSchemaObject(GetManagerDataOutput)
  data: GetManagerDataOutput;
}
