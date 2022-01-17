import { IsEmail, IsString, MinLength } from 'shared/decorators/ValidationDecorator';

export class ValidateForgotKeyForEmailInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(64)
  forgotKey: string;
}
