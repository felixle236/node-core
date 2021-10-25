import { IsNumber, IsOptional, Max, Min } from '@shared/decorators/ValidationDecorator';

export class PaginationRequest {
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
