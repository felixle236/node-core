import { GenderType } from 'domain/enums/user/GenderType';
import { IsDateOnlyString, IsEnum, IsOptional, IsString, MaxLength, IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class UpdateManagerInput {
  @IsString()
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  lastName?: string;

  @IsEnum(GenderType)
  @IsOptional()
  gender?: GenderType;

  @IsDateOnlyString()
  @IsOptional()
  birthday?: string;
}

export class UpdateManagerOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
