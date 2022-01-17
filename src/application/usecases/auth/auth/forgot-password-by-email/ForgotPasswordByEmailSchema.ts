import { IsEmail, IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class ForgotPasswordByEmailInput {
  @IsEmail()
  email: string;
}

export class ForgotPasswordByEmailOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
