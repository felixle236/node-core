import { IsEmail, IsOptional, IsString, Length, MaxLength, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

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

export class CreateManagerOutput extends DataResponse<string> {
  @IsUUID()
  data: string;
}
