import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsDateString, IsObject, IsOptional, IsString, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetManagerData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

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

    @IsDateString()
    @IsOptional()
    archivedAt?: Date;
}

export class GetManagerOutput extends DataResponse<GetManagerData> {
    @IsObject()
    @RefSchemaObject(GetManagerData)
    data: GetManagerData;
}
