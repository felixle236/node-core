import { IsEmail, IsString, Length } from 'shared/decorators/ValidationDecorator';

export class LoginByEmailInput {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
