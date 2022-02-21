import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { GenderType } from 'domain/enums/user/GenderType';
import { AddressInfoData } from 'application/usecases/common/AddressInfoData';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetClientDataOutput {
  @IsUUID()
  id: string;

  @IsDateString()
  createdAt: Date;

  @IsEnum(ClientStatus)
  status: ClientStatus;

  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEnum(GenderType)
  @IsOptional()
  gender?: GenderType;

  @IsString()
  @IsOptional()
  birthday?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  @RefSchemaObject(AddressInfoData)
  address?: AddressInfoData;

  @IsString()
  @IsOptional()
  locale?: string;

  @IsDateString()
  @IsOptional()
  activedAt?: Date;

  @IsDateString()
  @IsOptional()
  archivedAt?: Date;
}

export class GetClientOutput extends DataResponse<GetClientDataOutput> {
  @IsObject()
  @RefSchemaObject(GetClientDataOutput)
  data: GetClientDataOutput;
}
