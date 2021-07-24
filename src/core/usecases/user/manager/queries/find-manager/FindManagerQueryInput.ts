import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindManagerQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;

    @IsEnum(ManagerStatus)
    @IsOptional()
    status: ManagerStatus;
}
