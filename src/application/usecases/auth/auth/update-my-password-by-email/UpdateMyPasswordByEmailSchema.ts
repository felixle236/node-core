import { IsString, Length, IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class UpdateMyPasswordByEmailInput {
  @IsString()
  @Length(6, 20)
  oldPassword: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class UpdateMyPasswordByEmailOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
