import { IsBoolean, IsDate } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class UpdateUserOnlineStatusInput {
  @IsBoolean()
  isOnline: boolean;

  @IsDate()
  onlineAt: Date;
}

export class UpdateUserOnlineStatusOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
