import { AuthType } from 'domain/enums/auth/AuthType';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsEnum, IsObject, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetUserAuthByJwtDataOutput {
  @IsUUID()
  userId: string;

  @IsUUID()
  roleId: string;

  @IsEnum(AuthType)
  type: AuthType;
}

export class GetUserAuthByJwtOutput extends DataResponse<GetUserAuthByJwtDataOutput> {
  @IsObject()
  @RefSchemaObject(GetUserAuthByJwtDataOutput)
  data: GetUserAuthByJwtDataOutput;
}
