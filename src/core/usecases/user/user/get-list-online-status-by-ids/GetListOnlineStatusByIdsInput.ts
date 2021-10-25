import { ArrayMaxSize, ArrayMinSize, IsArray } from '@shared/decorators/ValidationDecorator';

export class GetListOnlineStatusByIdsInput {
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(100)
    ids: string[];
}
