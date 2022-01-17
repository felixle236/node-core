import { IsEmail, IsOptional, IsString, Length, MaxLength } from 'shared/decorators/ValidationDecorator';

export class CreateManagerInput {
  @IsString()
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
