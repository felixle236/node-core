import { IsArray } from 'class-validator';

export class GetListOnlineStatusByIdsQueryInput {
    @IsArray()
    ids: string[];
}
