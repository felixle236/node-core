import { IsEmail, IsString, MinLength, IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class ValidateForgotKeyForEmailInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(64)
  forgotKey: string;
}

export class ValidateForgotKeyForEmailOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
