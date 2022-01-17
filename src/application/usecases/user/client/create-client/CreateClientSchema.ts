import { GenderType } from 'domain/enums/user/GenderType';
import { AddressInfoData } from 'application/usecases/common/AddressInfoData';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import {
  IsDateOnlyString,
  IsEmail,
  IsEnum,
  IsLocale,
  IsUUID,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
} from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class CreateClientInput {
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

export class CreateClientOutput extends DataResponse<string> {
  @IsUUID()
  data: string;
}
