import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class QueryPaginationRequest {
    @IsNumber()
    @Min(0)
    @IsOptional()
    skip = 0;

    @IsNumber()
    @Min(1)
    @Max(10)
    @IsOptional()
    limit = 10;
}
