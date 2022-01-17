import { IsEmail, IsString, MinLength, IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class ActiveClientInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(64)
  activeKey: string;
}

export class ActiveClientOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
