import { IsArray, IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

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
    @JSONSchema({ type: 'array', items: { $ref: '#/components/schemas/' + GetListOnlineStatusByIdsQueryData.name } })
    data: GetListOnlineStatusByIdsQueryData[];
}
