import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { GenderType } from 'domain/enums/user/GenderType';
import { AddressInfoData } from 'application/usecases/common/AddressInfoData';
import { RefSchemaArray, RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsEnum, IsOptional, IsArray, IsDateString, IsObject, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { PaginationRequest } from 'shared/usecase/PaginationRequest';
import { PaginationResponse } from 'shared/usecase/PaginationResponse';

export class FindClientInput extends PaginationRequest {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;
}

export class FindClientDataOutput {
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
}

export class FindClientOutput extends PaginationResponse<FindClientDataOutput> {
  @IsArray()
  @RefSchemaArray(FindClientDataOutput)
  data: FindClientDataOutput[];
}
