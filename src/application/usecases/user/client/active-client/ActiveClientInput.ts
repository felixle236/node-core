import { IsEmail, IsString, MinLength } from 'shared/decorators/ValidationDecorator';

export class ActiveClientInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(64)
  activeKey: string;
}
