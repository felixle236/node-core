import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsDateString, IsObject, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetProfileManagerDataOutput {
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

export class GetProfileManagerOutput extends DataResponse<GetProfileManagerDataOutput> {
  @IsObject()
  @RefSchemaObject(GetProfileManagerDataOutput)
  data: GetProfileManagerDataOutput;
}
