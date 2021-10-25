import { GenderType } from '@domain/enums/user/GenderType';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from '@shared/decorators/ValidationDecorator';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';

export class FindClientData {
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
}

export class FindClientOutput extends PaginationResponse<FindClientData> {
    @IsArray()
    @RefSchemaArray(FindClientData)
    data: FindClientData[];
}
