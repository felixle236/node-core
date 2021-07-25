import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { IsArray, IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class GetListOnlineStatusByIdsQueryData {
    @IsUUID()
    id: string;

    @IsBoolean()
    isOnline: boolean;

    @IsDateString()
    @IsOptional()
    onlineAt: Date;
}

export class GetListOnlineStatusByIdsQueryOutput {
    @IsArray()
    @RefSchemaArray(GetListOnlineStatusByIdsQueryData)
    data: GetListOnlineStatusByIdsQueryData[];
}
