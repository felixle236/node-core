import { IsEmail, IsOptional, IsString, Length, MaxLength, IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class RegisterClientInput {
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

export class RegisterClientOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
