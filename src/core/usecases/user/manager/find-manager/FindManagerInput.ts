import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { IsEnum, IsOptional, IsString } from '@shared/decorators/ValidationDecorator';
import { PaginationRequest } from '@shared/usecase/PaginationRequest';

export class FindManagerInput extends PaginationRequest {
    @IsString()
    @IsOptional()
    keyword: string;

    @IsEnum(ManagerStatus)
    @IsOptional()
    status: ManagerStatus;
}
