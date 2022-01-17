import { IsEmail, IsString, IsUUID, Length } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class CreateAuthByEmailInput {
  @IsUUID()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class CreateAuthByEmailOutput extends DataResponse<string> {
  @IsUUID()
  data: string;
}
