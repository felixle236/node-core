import { IsEmail, IsString, Length, MinLength, IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class ResetPasswordByEmailInput {
  @IsString()
  @MinLength(64)
  forgotKey: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class ResetPasswordByEmailOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
