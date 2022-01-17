import { AuthType } from 'domain/enums/auth/AuthType';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsEmail, IsString, Length, IsJWT, IsObject, IsUUID, IsEnum } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class LoginByEmailInput {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class LoginByEmailDataOutput {
  @IsJWT()
  token: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  roleId: string;

  @IsEnum(AuthType)
  type: AuthType;
}

export class LoginByEmailOutput extends DataResponse<LoginByEmailDataOutput> {
  @IsObject()
  @RefSchemaObject(LoginByEmailDataOutput)
  data: LoginByEmailDataOutput;
}
