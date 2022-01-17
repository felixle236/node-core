import { AuthType } from 'domain/enums/auth/AuthType';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsJWT, IsObject, IsUUID, IsEnum } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class LoginByEmailData {
  @IsJWT()
  token: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  roleId: string;

  @IsEnum(AuthType)
  type: AuthType;
}

export class LoginByEmailOutput extends DataResponse<LoginByEmailData> {
  @IsObject()
  @RefSchemaObject(LoginByEmailData)
  data: LoginByEmailData;
}
