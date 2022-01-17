import { GenderType } from 'domain/enums/user/GenderType';
import { AddressInfoData } from 'application/usecases/common/AddressInfoData';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsDateOnlyString, IsEnum, IsLocale, IsObject, IsOptional, IsPhoneNumber, IsString, MaxLength, IsBoolean } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class UpdateClientInput {
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

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  @RefSchemaObject(AddressInfoData)
  address?: AddressInfoData;

  @IsLocale()
  @IsOptional()
  locale?: string;
}

export class UpdateClientOutput extends DataResponse<boolean> {
  @IsBoolean()
  data: boolean;
}
