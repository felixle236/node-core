import { GenderType } from '@domain/enums/user/GenderType';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString, IsUUID } from '@shared/decorators/ValidationDecorator';
import { DataResponse } from '@shared/usecase/DataResponse';

export class GetClientData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
    email: string;

    @IsString()
    @IsOptional()
    avatar: string;

    @IsEnum(GenderType)
    @IsOptional()
    gender: GenderType;

    @IsString()
    @IsOptional()
    birthday: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    locale: string;

    @IsDateString()
    @IsOptional()
    activedAt: Date;

    @IsDateString()
    @IsOptional()
    archivedAt: Date;
}

export class GetClientOutput extends DataResponse<GetClientData> {
    @IsObject()
    @RefSchemaObject(GetClientData)
    data: GetClientData;
}
