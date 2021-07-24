import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { QueryPaginationRequest } from '@shared/usecase/QueryPaginationRequest';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindClientQueryInput extends QueryPaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;

    @IsEnum(ClientStatus)
    @IsOptional()
    status: ClientStatus;
}
