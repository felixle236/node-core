import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';

export class GetListOnlineStatusByIdsQueryInput {
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(100)
    ids: string[];
}
